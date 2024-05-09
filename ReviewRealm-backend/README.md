
# ReviewViz Backend

Visualize customer sentiment for smarter purchasing and marketing decisions :sparkles:

ReviewViz is a sentiment analysis-based review visualization platform that aims to help consumers make informed purchasing decisions. The platform is designed to scrape reviews from a given Amazon URL, perform sentiment analysis on the text, and generate a word cloud that categorizes the words used in the reviews. This word cloud provides an easy-to-read visualization of the overall sentiment towards the product, as well as the most frequently used terms in the reviews.

The backend of ReviewViz is built using FastAPI and MongoDB. It includes user registration and login functionality, as well as token-based authentication using JWT Tokens. The scraper used internally is asynchronous to handle large requests concurrently.



## Environment Variables

Rename the `.env.sample` file to `.env`.  
To run this project, you will need to add the following environment variables to your .env file

`MONGODB_CONNECTION_URI`  
`SECRET_KEY` 

The `MONGODB_CONNECTION_URI`  can be found out from the Atlas dashboard or if using locally, attach your localhost connection string.  

Generate `SECRET_KEY` using the following command:
```bash
openssl rand -hex 32
```


## Installation

To run the backend, please follow the below steps:
Install pipenv using pip install pipenv.  
Then in the folder, run the following commands:
```bash
  pipenv install
  pipenv run python initial-nlp-libraries.py 
```
This would install the libraries required with NLTK to the `nltk_data` directory.  

Now run the following commands:
```bash
  pipenv run python -m app
```
The server should now be up and running on `localhost:8100`.
## API Reference

The API documentation is available at `localhost:8100/docs`.   
This provides detailed information about the available endpoints and their parameters.
## Contributing

Contributions are always welcome!  
Please feel free to submit pull requests and report any issues or bugs that you encounter.

