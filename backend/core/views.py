from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt  # Disable CSRF for simplicity, but not recommended for production without precautions
def your_view(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            name = data.get('name')
            age = data.get('age')

            # Process the data or save it to the database
            # Example: print it to the console
            print(f"Received: {name}, {age}")

            # Return a success response
            return JsonResponse({'message': 'Data received successfully', 'name': name, 'age': age})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
