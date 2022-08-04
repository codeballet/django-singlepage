import json
from django.http.response import JsonResponse
from django.shortcuts import render

from .models import Entry

# Create your views here.
def index(request):
    """Render index view"""
    return render(request, "entries/index.html")

#######
# API #
#######

def add_api(request):
    """Add entry to database"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            new_entry = Entry(entry=data["entry"])
            new_entry.save()
            return JsonResponse({
                "message": f"Added '{new_entry}'"
            })
        except:
            return JsonResponse({
                "error": "Could not save entry to database"
            })

def delete_api(request, id):
    """Delete entry from database"""
    if request.method != "DELETE":
        return JsonResponse({
            "error": "DELETE request required"
        }, status=405)

    try:
        # delete entry
        entry = Entry.objects.get(pk=id)
        entry.delete()
        return JsonResponse({
            "message": f"Entry deleted: {entry.entry}"
        })
    except:
        return JsonResponse({
            "Error": "Failed to delete entry"
        })

def entries_api(request):
    """Aquire all entries"""
    try:
        entries = Entry.objects.values_list()
        
        # turn entries into a dict
        entries_dict = {}
        for entry in entries:
            entries_dict[entry[0]] = entry[1]

        return JsonResponse({
            "entries": entries_dict
        }, status=200)
    except:
        return JsonResponse({
            "error": 'Could not retreive entries'
        }, status=404)