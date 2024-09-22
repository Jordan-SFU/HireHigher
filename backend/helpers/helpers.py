from chat import *
from speech import *

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
analyzedData = chat_manager.analyzeData(user_input)
print(analyzedData)
questions = chat_manager.generateQuestions(3, user_input)
print(questions)

generateQuestionsAudio(questions)


# DO NOT CALL THIS FUNCTION I WILL GO BROKE
# def generateReplies():
#     replies = [
#         "Thank you for your answer!",
#         "I see, great to hear!",
#         "That's an interesting perspective!",
#         "I appreciate your insight on that.",
#         "Thanks for sharing your thoughts.",
#         "That's a good point!",
#         "Great response, thank you!"
#     ]

#     for i in len(replies):
#         text_to_speech_file(replies[i], f"replies/{i}")

