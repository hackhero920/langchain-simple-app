import unittest
from fastapi.testclient import TestClient
from chatbot import app, QueryRequest
import os
import sys
sys.path.append("..")

class ChatbotEndpointTestCase(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_chatbot_endpoint(self):
        query = "give me step by step guide to install React in my macOS"
        request_data = {"query": query}

        response = self.client.post("/chatbot", json=request_data)

        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()