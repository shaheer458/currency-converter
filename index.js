#!/usr/bin/env node
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import boxen from "boxen";
import axios from 'axios';
// step 1 class for Animated title of Application,
class converter {
    async welcome() {
        let title = chalkAnimation.karaoke(boxen('Currency Converter ', { padding: 1, margin: 1, borderStyle: 'double', borderColor: "blue" }));
        await this.stopAnimation(title, 3);
    }
    ;
    stopAnimation(animation, duration) {
        return new Promise((resolve) => {
            setTimeout(() => {
                animation.stop();
                resolve();
            }, duration * 1000);
        });
    }
}
const currency = new converter();
currency.welcome();
// step:2 Function to fetch exchange rates from the API
async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        return response.data.rates;
    }
    catch (error) {
        console.error('Error fetching exchange rates:', error.message);
        return {};
    }
}
// Step:3 Function to perform currency conversion
function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    return (amount / fromRate) * toRate;
}
// step:4 Main function to prompt user input and perform conversion
async function main() {
    const userInput = await inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'Enter the amount to convert:'
        },
        {
            type: 'input',
            name: 'fromCurrency',
            message: 'Enter the currency to convert from (e.g., USD):'
        },
        {
            type: 'input',
            name: 'toCurrency',
            message: 'Enter the currency to convert to (e.g., EUR):'
        }
    ]);
    const { amount, fromCurrency, toCurrency } = userInput;
    const exchangeRates = await fetchExchangeRates(fromCurrency);
    const convertedAmount = convertCurrency(parseFloat(amount), fromCurrency.toUpperCase(), toCurrency.toUpperCase(), exchangeRates);
    console.log(`${amount} ${fromCurrency} equals ${convertedAmount.toFixed(2)} ${toCurrency}`);
}
// Call the main function
main();
