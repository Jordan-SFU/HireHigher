import openai
import os
from dotenv import load_dotenv

# API key is stored in a separate file
load_dotenv()


# Set the API key when using OpenAI API
openai.api_key = "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"

class chatManager:

    def __init__(self):
        self.chatHistory = []
    
    def send_message(self, user_input):
        response = openai.chat.completions.create(
            model = "gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": """Given the data, do a brief yet short summary of this person's skills"""
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

    def analyzeUserResponse(self, user_response):
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are a job interviewer evaluating a candidate's response during an interview.
                    Analyze the candidate's answer in terms of clarity, relevance, and how well it fits the job they are applying for.
                    """
                },
                {
                    "role": "user",
                    "content": user_response
                }
            ]
        )
        self.chatHistory.append(response.choices[0].message.content)
        return response.choices[0].message.content

    
    def analyzeData(self, resumeData):
        response = openai.chat.completions.create(
            model = "gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": """
                    Pretend you are a recruiter given the following JSON-like data.
                    {
                        jobTitle: The job the person wants to interview for
                        additionalInfo: any additional information the person wants to provide about themself. Keep in mind some of this data may be biased, or unrelated.
                        linkedInProfile: raw data scraped from their linkedin
                        resume:  raw resume data
                    }

                    Keep in mind that any of these fields could be left blank. 
                    Provided this  information, I want you to analyze the person's skills and respond in a JSON-like format yourself. Respond as follows:

                    {
                        previousWork: What are some previous positions this person has held? Respond in a list in the format of Job_Title@Company_Name. Limit yourself to 3 responses, ordered from most relevant to least relevant,
                                      and secondly prioritized by most recent to least recent.
                                      Generalize the position if necessary like "Cashier@Superstore" or "Barista@Starbucks" or "Software Developer@Microsoft". This is to avoid weird position names like "Client support analyst" that
                                      really means "IT Technician". If you are not sure, read through the experience and make a guess on what the job could be.
                        relatedWork: Do the same prompt as the previousWork, but make a list the jobs that are related to the job they are applying for. For each job, provide a 1-sentence summary
                                     of the person's job based off of the description. If none are related, respond with "None".
                        skills: List the skills the person has, separated by commas, order from what you think would be most to least relevant to the job. Limit yourself to max 7 skills.
                        Education: List what type of education they have.
                        Projects: KEEP IN MIND NOT ALL RESUMES HAVE PROJECTS. IF THE RESUME DOES NOT HAVE PROJECTS, RESPOND WITH "None". IF THEY ARE NOT LOOKING FOR A SOFTWARE DEVELOPMENT/ENGINEERING JOB, RESPOND with "None"
                                List any relevant projects they have worked on, separated by commas. Limit yourself to max 3 projects, ordered from most to least relevant. Similar to related Work, provide a list of 1 sentence summaries.
                                Again, not all resumes have projects. This is really only relevant if they are looking to apply for software development/engineering job, so only take in projects if they are looking for these jobs.
                                And even if they are looking software development/engineering job, only search for projects if they have explicitly mentioned them in their resume.
                        Keywords: List any keywords they mentioned ONLY IN DESCRIPTIONS you think are relevant to the job, separated by commas. These keywords MUST have been mentioned in the data provided to you other
                                    than the job title. Do not make up words. 
                                    Limit yourself to max 7 keywords, ordered from most to least relevant.
                    }

                    Example Answers:
                    (For say, a software developer)
                    {
                        "previousWork": [
                            "Software Developer@Microsoft", 
                            "Software Developer@Google", 
                            "Web Developer@Amazon"]
                        "relatedWork": [
                            "Software Developer@Microsoft: Developed and maintained software for the Windows operating system",
                            "Software Developer@Google: Developed and maintained the Google search engine",
                            "Web Developer@Amazon: Developed and maintained the Amazon website"
                        ]
                        "Projects": [
                            "ChatGPTClone: Developed a chatbot similar to GPT-3",
                            "WebScraper: Developed a web scraper to scrape",
                            "PersonalWebsite: Developed a personal website to showcase my projects"
                        ]
                        "skills": ["Python", "Java", "C++", "SQL", "HTML", "CSS", "JavaScript"]
                        "Education": "Bachelor's Degree in Computer Science from University of Toronto"
                        "Keywords": ["Django", "Flask", "REST API", "AWS", "Azure", "Docker", "Kubernetes"]
                    }
                    (For say, an accountant job)
                    {
                        "previousWork": ["Accountant@Deloitte", "Cashier@McDonalds"]
                        "relatedWork": [
                            "Accountant@Deloitte: Managed financial records for a variety of clients"
                        ]
                        "skills": ["Accounting", "Microsoft Excel", "Quickbooks", "Communication", "Research", "Leadership"]
                        "Projects": []
                        "Education": "Bachelor's Degree in Accounting from University of British Columbia"
                        "Keywords": ["Financial Records", "Managed", "Excel", "Quickbooks", "Communication", "Research", "Leadership"]
                    }
                    (For say, a Teenager applying for retail worker positions. )
                    {
                        "previousWork": []
                        "relatedWork": []
                        "skills": ["Customer Service", "Microsoft Office", "Communication", "Research", "Leadership"]
                        "Projects": []
                        "Education": "High School Diploma"
                        "Keywords": ["Customer Service", "Communicated", "Led", "Managed", "Raised", "Engaged", "Problem Solving"]
                    }
                    (The person did not provide any info except their job title)
                    {
                        "previousWork": []
                        "relatedWork": []
                        "skills": []
                        "Projects": []
                        "Education": ""
                        "Keywords": []
                    }

                    """
                },
                {
                    "role": "user",
                    "content": resumeData
                }
            ]
        )
        self.chatHistory.append(response.choices[0].message.content)
        return response.choices[0].message.content

    def generateQuestions(self, amount, ResumeData):
        response = openai.chat.completions.create(
            model = "gpt-4o-mini",
            messages = [
                {
                    "role": "system",
                    "content": f"""Pretend you are an interviewer. Generate {amount} questions in a list based off of the following data. Regardless of amount, generate minimum 3 questions. The data is as follows:
                    {ResumeData}
                    Now, keep in mind that the questions should be relevant to the job title and the additional information provided. The questions should be open-ended and should not be too specific.
                    From the resume data, I want you to follow these rules:
                        0. This rule takes precedence over the others. at least two-thirds of the questions asked must NOT be about the person's work experience, skills or projects. e.g. of they have 3 questions, only
                            ask 1 question about work experience, skills, or projects. If they have 4 questions, only ask 1 question about work experience, skills, or projects. If they have 5 questions, only ask 2 questions about work experience, skills, or projects, and so on.
                        1. If the person has had previous work experience, ask 0 to 2 questions about their previous work experience If they have had relevant work experience PRIORITIZE THAT. Examples:

                            a. "I see you have worked at [Company Name] as a [Job Title]. What do you think was the biggest lesson from the job?"
                            b. [Job Title] at [Company Name]! What was your experience like there?"
                            c. "I see you have worked at [Company Name] as a [Job Title]. What was a time you had to deal with a difficult situation there?"
                            d. "It's good to see [Job Title] at [Company Name] on your resume. Can you tell me more about your experience there?"

                        2. If the person has many relevant skills OR projects, ask 1 question about their skills. Examples:

                            a. "I see you have experience in [Skill 1], [Skill 2], and [Skill 3]. Can you tell me more about how you have applied those skills?
                            b. "I see you have worked on [Project 1], [Project 2], and [Project 3]. Tell me more about these projects"
                            c. What was the most challenging project you have worked on and how did you overcome it?
                            d. What was the most challenging skill you have had to learn and how did you learn it?

                    Again, the questions MUST make sense for the type of interview they are doing. If they are applying as a cashier, do not ask them about their Python Coding skills. Generate the questions in a list of strings like this:
                    {{"What were some challenges you faced working at Google?", 
                    "What was the most challenging project you have worked on and how did you overcome it?", 
                    "What was the most challenging skill you have had to learn and how did you learn it?"}}

                    Again, the questions should be in the format of a json list, with each question having the key "(question number)" where the question number is the number of the question. e.g. "1", "2", "3", etc.
                    example:
                    {{"1": "What were some challenges you faced working at Google?", "2": "What was the most challenging project you have worked on and how did you overcome it?", "3": "What was the most challenging skill you have had to learn and how did you learn it?", ...}}
                    """
                }
            ]
        )
        self.chatHistory.append(response.choices[0].message.content)
        return response.choices[0].message.content

    def display_message_history(self):
        return self.chatHistory
    
    def clear_chat_history(self):
        self.chatHistory = []



chat_manager = chatManager()
user_input = """
{
    jobTitle: Software Developer
    additionalInfo: I'm good at math, science, coding, and I'm a fast learner. I'm also a team player and I'm good at problem solving. I'm also good at communicating with others.
    linkedInProfile: 
    resume:  
****** Result for Image/Page 1 ******
Riley Su	
778-322-3428 | rileysu05@qmail.com I LinkedIn	
Education	
University of British Columbia	September 2022	- Present	
Bachelor of Applied Science - Computer Engineering	
Extra-Curricular / Volunteer / Work Experience	
Fair Bee/Crépe Delicious RC - Cashier + Barista	August 2021 - October 2021	
Youth Civic Engagement Program	September 2021 - November 2021	
Shoppers Drug Mart Pharmacist Assistant Volunteer	October 2021 - June 2022	
Pre-Calculus 12 + Differential Calculus Tutor	September 2022 - April 2023	
Technical Projects	
Gaming Website Collaborative Project	April 2023 — Present	
• Constructed website using HTML/CSS — for hosting and uploading video games	
Wooden Catapult Device	April 2022 -June 2022	
Modeled in Autodesk Inventor, brought to life with laser/3D printing	
Skills and Abilities	
Technical skills - proficient in Microsoft Word/Excel and AutoCAD/Fusion360	
Programming skills - experience in C/C++, Python, MATLAB, LaTeX, HTML/CSS	
Leadership, management and responsibility	
Positive attitude and behaviour	
Achievements / Certifications	Scholarships	
June 2021 | Principal's Honour Roll	October 2022 | BC Achievement Scholarship	
July 2021 | Senior CAD Award	- Ministry of Education and Child Care	
June 2022 | AP Calculus Academic Award	October 2022 | Noah Yelizarov Memorial	
Scholarship	
Hobbies and Interests	
e Graphic design, Music production, Biking	

}
"""
# analyzedData = chat_manager.analyzeData(user_input)
# print(analyzedData)
# questions = chat_manager.generateQuestions(5, user_input)
# print(questions)
# print(chat_manager.display_message_history())
# chat_manager.clear_chat_history()
# print(chat_manager.display_message_history())