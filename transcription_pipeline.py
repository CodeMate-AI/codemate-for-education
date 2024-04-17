from transformers import pipeline
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor
import json
import time

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "distil-whisper/distil-large-v3"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)



model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    max_new_tokens=128,
    torch_dtype=torch_dtype,
    device=device,
)

start = time.time()
res = pipe("./sweet_child_o_mine.mp3", return_timestamps=True)
# print(res["text"])
with open("temp-wlv3.txt", "w", encoding="utf-8") as e:
    json.dump(res, e, indent=4)

print("TOTAL TIME TAKEN: ", time.time() - start, " seconds")