# Spell Card PDF Generator

A simple Node.js script to convert a CSV file of spell data into a printable PDF of spell cards.

## Prerequisites

You must have [Node.js](https://nodejs.org/) installed on your computer.

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/spell-card-generator.git](https://github.com/your-username/spell-card-generator.git)
    cd spell-card-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the script:**
    ```bash
    node index.js
    ```

This will generate a file named `spell-cards.pdf` in the project folder.

## Customization

* **Spells:** Edit the `spells.csv` file to add, remove, or change spells. The first row **must** contain the headers.
* **Card Styles:** Edit the `card-template.css` file to change the appearance of the cards.