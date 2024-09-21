import openai

# API key is stored in a separate file
API_KEY = open("API_KEY", "r").read()
openai.api_key = API_KEY

class chatManager:

    def __init__(self):
        self.chatHistory = []
    
    def send_message(self, user_input):
        response = openai.chat.completions.create(
            model = "gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": """You are an interviewer giving an interview for a moon exploder role position. 
                    Limit yourself to short concise, answers and speak in a british, posh tone."""
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        )
        self.chatHistory.append(response.choices[0].message.content)
        return response.choices[0].message.content
    
    # maybe delete this later
    def send_message_custom(self, sys_input, user_input):
        response = openai.chat.completions.create(
            model = "gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": sys_input
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        )
        self.chatHistory.append(response.choices[0].message.content)
        return response.choices[0].message.content

    def display_message_history(self):
        return self.chatHistory
    
    def clear_chat_history(self):
        self.chatHistory = []


while(True):
    chat_manager = chatManager()
    user_input = "ask me a question"
    response_content = chat_manager.send_message(user_input)
    print(response_content)
    print(chat_manager.display_message_history())
    chat_manager.clear_chat_history()
    print(chat_manager.display_message_history())