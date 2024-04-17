#!/bin/bash

# Record start time
start_time=$(date +%T)

echo "Current Time: $start_time"

# Run the desired command
whisper dsa.mp3 --model medium.en --word_timestamps True --output_format srt --device cpu

# Record end time
end_time=$(date +%T)

echo "End Time: $end_time"

# Calculate and display execution time
start_seconds=$(date -d "$start_time" +%s)
end_seconds=$(date -d "$end_time" +%s)

execution_time=$((end_seconds - start_seconds))

echo "Time taken to complete execution: $execution_time seconds"