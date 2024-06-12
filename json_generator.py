import pandas as pd
import json


def excel_to_json(file_path, output_path):
    df = pd.read_excel(file_path)
    if df.columns.nlevels == 0:
        df.columns = df.columns.astype(str)
    for col in df.columns:
        df[col] = df[col].apply(lambda x: x.replace('_x000D_', '').
                                replace('\n', '\\n').replace('\"', '\\"')
                                .replace('\t', '\\t') if isinstance(x, str) else x)
        df[col] = df[col].apply(lambda x: '' if pd.isnull(x) else x)
    json_data = df.to_json(orient='records', force_ascii=False)
    parsed_json = json.loads(json_data)
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(parsed_json, json_file, ensure_ascii=False, indent=4)


file_path = 'Metersphere_cases.xlsx'
output_path = 'output.json'
excel_to_json(file_path, output_path)
