#!/usr/bin/env python3
import vonage

try:
    print("Vonage SDK dir:", dir(vonage))
    
    # Try to initialize the client
    try:
        # Try different initialization methods
        print("Trying vonage.Client...")
        if hasattr(vonage, 'Client'):
            client = vonage.Client(key="test", secret="test")
            print("Client initialized successfully")
            print("Client dir:", dir(client))
        else:
            print("vonage.Client not found")
        
        print("\nTrying vonage.Vonage...")
        if hasattr(vonage, 'Vonage'):
            client = vonage.Vonage(key="test", secret="test")
            print("Vonage initialized successfully")
            print("Vonage dir:", dir(client))
        else:
            print("vonage.Vonage not found")
            
    except Exception as e:
        print("Failed to initialize client:", e)
    
except Exception as e:
    print("Error:", e)