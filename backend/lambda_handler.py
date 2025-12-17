import json
import os
import boto3


# 設定

BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")
BEDROCK_REGION = os.getenv("BEDROCK_REGION", "us-east-1")
MAX_TOKENS = 2048


# プロンプトテンプレート

THEME_PROMPTS = {
    "manzai": {
        "name": "漫才風",
        "system": """あなたは漫才作家です。与えられたテキストをボケとツッコミの掛け合い形式に変換してください。

ルール:
- 「ボケ：」「ツッコミ：」で始める
- ツッコミは関西弁で「なんでやねん」等を使う
- 10往復程度の掛け合い
- 元テキストの内容は必ず含める"""
    },
    "kaidan": {
        "name": "怪談風",
        "system": """あなたは怪談語りの名人です。与えられたテキストを不気味な怪談話に変換してください。

ルール:
- 一人称視点の語り口調
- 「これは私が体験した話です...」のような導入
- じわじわと恐怖を煽る描写
- 「...」を効果的に使う
- 800文字程度"""
    },
}



# Bedrock クライアント

def get_bedrock_client():
    if not hasattr(get_bedrock_client, "_client"):
        get_bedrock_client._client = boto3.client(
            "bedrock-runtime", region_name=BEDROCK_REGION
        )
    return get_bedrock_client._client


def call_bedrock(system_prompt: str, user_text: str) -> str:
    client = get_bedrock_client()
    
    request_body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": MAX_TOKENS,
        "temperature": 0.8,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_text}],
    })
    
    response = client.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=request_body,
    )
    
    response_body = json.loads(response["body"].read())
    return response_body["content"][0]["text"]



# HTTP レスポンスヘルパー

def response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
        "body": json.dumps(body, ensure_ascii=False),
    }

# lambda ハンドラー

def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return response(200, {})
    
    path = event.get("path", "")
    method = event.get("httpMethod", "")
    
    # GET /themes - テーマ一覧
    if path == "/themes" and method == "GET":
        themes = [
            {"id": tid, "name": data["name"]}
            for tid, data in THEME_PROMPTS.items()
        ]
        return response(200, {"themes": themes})
    
    # POST /transform - テキスト変換
    if path == "/transform" and method == "POST":
        try:
            body = json.loads(event.get("body", "{}"))
            text = body.get("text", "").strip()
            theme_id = body.get("theme_id", "")
            
            # バリデーション
            if not text:
                return response(400, {"error": "テキストを入力してください"})
            if len(text) > 2000:
                return response(400, {"error": "テキストは2000文字以内で入力してください"})
            if theme_id not in THEME_PROMPTS:
                return response(400, {"error": f"無効なテーマです: {theme_id}"})
            
            # 変換実行
            theme = THEME_PROMPTS[theme_id]
            transformed = call_bedrock(theme["system"], text)
            
            return response(200, {
                "theme_id": theme_id,
                "theme_name": theme["name"],
                "original": text,
                "transformed": transformed,
            })
            
        except json.JSONDecodeError:
            return response(400, {"error": "リクエストが不正です"})
        except Exception as e:
            print(f"Error: {e}")
            return response(500, {"error": "変換処理中にエラーが発生しました"})
    
    
    if path == "/health":
        return response(200, {"status": "ok"})
    
    return response(404, {"error": "Not Found"})