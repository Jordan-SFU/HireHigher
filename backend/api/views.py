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
    user_input = request.data["resume"]
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
    for i in range(0, len(request.data)):
        # check if the key exists
        if 'question' + str(i + 1) not in request.data:
            break

        user_input = request.data['question' + str(i + 1)]
        analysis = chat_manager.analyzeUserResponse(user_input)
        analyses.append(analysis)
        print(i)
        print("     ")
        print(analysis)
        print("\n\n\n")
    return Response({"analyses": analyses})