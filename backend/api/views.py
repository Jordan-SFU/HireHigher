from rest_framework.response import Response # takes in any python/serialized data to JSON
from rest_framework.decorators import api_view
from base.models import Item, ResumeInfo
from .serializers import ItemSerializer, ResumeInfoSerializer
from helpers.chat import chatManager

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializers = ItemSerializer(items, many=True) #many=True because we have multiple items
    return Response(serializers.data)

@api_view(['POST'])
def testData(request):
    print("Received POST data:", request.data)
    return Response({"message": "Data received successfully"})


@api_view(['POST'])
def processResumeInfo(request):
    serializer = ResumeInfoSerializer(data=request.data)
    if serializer.is_valid():
        # serializer.save()
        print("Received POST data:", request.data)

    print("Received POST data:", request.data)
    chat_manager = chatManager()
    user_input = str(request.data)
    resume_data = chat_manager.analyzeData(user_input)
    print(resume_data)
    questions = chat_manager.generateQuestions(5, resume_data)
    print(questions)
    return Response({"summary": resume_data, "questions": questions})

@api_view(['POST'])
def setupData(request):
    print("Received POST data:", request.data)
    return Response({"message": "Data received successfully"})

@api_view(['POST'])
def processTranscriptions(request):
    chat_manager = chatManager()
    analyses = []

    print("Received POST data:", request.data)
    print("\n\n\n")

    for i in range(0, len(request.data) // 2):  # Divide by 2 because each question has both question text and transcription
        question_key = f'question{i + 1}'
        transcription_key = f'transcription{i + 1}'

        # Check if both the question and transcription exist
        if question_key not in request.data or transcription_key not in request.data:
            break

        user_input = request.data[transcription_key]
        question_text = request.data[question_key]

        print(f"Processing Question {i + 1}: {question_text}")
        print(f"User's Response: {user_input}")

        # Analyze the user's response
        analysis = chat_manager.analyzeUserResponse(f"Question asked: {question_text}. Answer: {user_input}")
        analyses.append(analysis)
        print(i + 1)
        print("     ")
        print(analysis)
        print("\n\n\n")
        
    return Response({"analyses": analyses})
