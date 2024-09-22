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
    user_input = request.data
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
    try:
        # Assuming the transcript data is stored as a QueryDict in the format:
        # {'question1': ['transcript of user answer for question 1'], 'question2': ['transcript of user answer for question 2'], ...}
        transcripts = request.data  # Retrieve the QueryDict from the POST data

        if transcripts:
            analyses = {}  # To store the analysis results for each question
            for question, transcript_list in transcripts.items():
                # Assuming transcript_list is a list with one element, we get the first one
                transcript = transcript_list[0] if transcript_list else ''

                if transcript:
                    # Call the analyzeUserResponse function for each transcript
                    analysis = chat_manager.analyzeUserResponse(transcript)
                    analyses[question] = analysis  # Store the analysis for the respective question
                else:
                    analyses[question] = "No transcript provided for this question"

            return Response({"analyses": analyses})  # Return the analysis results for all questions
        else:
            return Response({"error": "No transcripts provided"}, status=400)
    except Exception as e:
        print(f"Error processing transcripts: {e}")
        return Response({"error": "Internal Server Error"}, status=500)