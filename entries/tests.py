from django.test import Client, TestCase

from .models import Entry

# Create your tests here.
class EntryTestCase(TestCase):

    def setUp(self):

        # Create entries
        e1 = Entry.objects.create(entry="First")
        e2 = Entry.objects.create(entry="")

    def test_valid_entry(self):
        """Database entry is valid"""
        e1 = Entry.objects.get(entry="First")
        self.assertTrue(e1.is_valid_entry())

    def test_invalid_entry(self):
        """Database entry is invalid"""
        e2 = Entry.objects.get(entry="")
        self.assertFalse(e2.is_valid_entry())

    def test_index(self):
        """Index page"""
        c = Client()
        response1 = c.get("/entries/")
        response2 = c.get("/entries/form")
        response3 = c.get("/entries/list")
        print(response1)
        print(response2)
        print(response3)
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)

    def test_api_entries(self):
        """API: entries list"""
        c = Client()
        response = c.get("/entries/api/entries")
        print(response)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["entries"]), 2)