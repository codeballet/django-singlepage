import json
from django.http import HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import Entry

# Create your views here.
def index(request):
    entries = Entry.objects.all()
    return render(request, "entries/index.html")

#######
# API #
#######

def add_api(request):
    if request.method == "POST":
        received = request.POST["entry"]
        new_entry = Entry(entry=received)
        new_entry.save()
        return HttpResponseRedirect(reverse("index"))

def delete_api(request, id):
    if request.method != "DELETE":
        return JsonResponse({
            "error": "DELETE request required"
        }, status=405)

    try:
        # delete entry
        entry = Entry.objects.get(pk=id)
        entry.delete()
    except:
        return JsonResponse({
            "Error": "Could not delete entry"
        })

    # render updated list
    entries = Entry.objects.all()
    return HttpResponseRedirect(reverse("index"))

def entries_api(request):
    try:
        entries = Entry.objects.values_list()
        entries_dict = {}
        for entry in entries:
            entries_dict[entry[0]] = entry[1]

        print(f"entries_dict: {entries_dict}")
        return JsonResponse({
            "entries": entries_dict
        }, status=200)
    except:
        return JsonResponse({
            "error": 'Could not retreive entries'
        }, status=404)