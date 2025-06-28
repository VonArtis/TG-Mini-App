#!/usr/bin/env python3
import vonage

try:
    print("Vonage SDK version:", vonage.__version__)
    print("Vonage SDK dir:", dir(vonage))
    
    # Try to initialize the client
    try:
        client = vonage.Client(key="test", secret="test")
        print("Client initialized successfully")
        print("Client dir:", dir(client))
    except Exception as e:
        print("Failed to initialize client:", e)
    
except Exception as e:
    print("Error:", e)