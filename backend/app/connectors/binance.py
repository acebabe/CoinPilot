"""
Binance connector stub.

- For real connections, use Binance SDK and store keys encrypted.
- This module provides a stub for testnet flows.
"""
import os
import logging

class BinanceConnector:
    def __init__(self, api_key=None, api_secret=None):
        self.api_key = api_key or os.getenv("BINANCE_API_KEY")
        self.api_secret = api_secret or os.getenv("BINANCE_API_SECRET")

    def validate_keys(self):
        """
        Validate API key by calling a safe endpoint (time ping/account).
        """
        logging.info("Validating binance keys (stub)")
        return True

    def fetch_account(self):
        """
        Fetch account balances (stub).
        """
        return {"balances":[{"asset":"BTC","free":"0.0","locked":"0.0"}]}

    def simulate_credit(self, account_id, amount):
        logging.info("Simulating credit on Binance testnet (stub)")
        return {"status":"ok","account_id": account_id, "amount": amount}