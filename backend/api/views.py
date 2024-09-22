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

        chat_manager = chatManager()
        user_input = request.data["resume"]
        response_content = chat_manager.send_message(user_input)

    print("Received POST data:", request.data)
    return Response(serializer.data, response_content)

@api_view(['POST'])
def setupData(request):
    print("Received POST data:", request.data)
    return Response({"message": "Data received successfully"})

@api_view(['POST'])
def processTranscriptions(request):
    print("Received POST data:", request.data)
    return Response({"message": "Data received successfully"})