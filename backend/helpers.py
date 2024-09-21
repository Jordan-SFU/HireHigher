from pdf import ocr_space_file
from chat import *

test_file = ocr_space_file(filename='TestResume.pdf', language='pol')
response_content = chat_manager.send_message(test_file)
print(response_content)