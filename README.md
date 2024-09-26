![Image Example](./frontend/src/styles/images/Example.gif)

# HireHigher

🏆 Winning Project of LangaraHacks 2024! 🏆

HireHigher is an AI-based interview simulator, designed to help you ace your next job interview. Taking in context from your job title, resume, and LinkedIn, HireHigher aims to provide a highly customizable and realistic experience.

# Tech Stack

- Our frontend was built with React and CSS, while our backend was built in Python with the Django REST framework. Hosted on AWS during the Hackathon.

- We used the Google Chrome Webkit Speech Recognition for our speech-to-text transcription. Resume information was scraped with the OCR API and LinkedIn profiles were scraped with Selenium. AI analysis tools were based off of OpenAi's GPT-4o-mini model.

# Usage

```git clone``` the repository with the following command.

```
git clone https://github.com/Jordan-SFU/HireHigher.git
```

Install missing Python dependancies and node modules.

```
pip install django-cors-headers djangorestframework django-posts python-dotenv
npm i
```

In order for the AI analysis to work, you will need to provide an OpenAI API key. In the main folder, create a ```.env``` file with the following text.

```
OPENAI_KEY=<YOUR_API_KEY_HERE>
```

Start the backend server with the following commands.

```
cd backend
python manage.py runserver
# python3 manage.py runserver for MacOS/Linux-based systems.
```

Start the frontend.

```
cd frontend
npm start
```
