from flask import Flask
import pandas as pd
from sqlalchemy import create_engine

# Create a DataFrame.
cars = {'Brand': ['Honda Civic','Toyota Corolla','Ford Focus','Audi A4', 'Honda Civic'],
        'Price': [22000,25000,27000,35000,23000],
        'Year': [2020,1991,2005,1980,2021]
        }
df = pd.DataFrame(cars, columns=['Brand', 'Price', 'Year'])

# Optionally: Save DataFrame to a SQL database.
engine = create_engine('sqlite:///CAR_INFO.db')
with engine.connect() as con:
    df.to_sql('CAR_DATA', con, if_exists='replace', index=True)
    df_neu = pd.read_sql("""SELECT * FROM CAR_DATA""", con)
df_neu.set_index('index', drop=True, inplace=True)
df_neu.reset_index(inplace=True)
df_neu.rename(columns={'index':'id'}, inplace=True)

# Set up web server.
app = Flask(__name__)

@app.route('/endpoint')
def export_df(dataframe=df_neu):
    """
    Export DataFrame as JSON object.
    """
    return dataframe.to_json(orient='records')

if __name__ == '__main__':
    host = '127.0.0.1'
    port = 4000
    app.logger.info('Starting web server on {}.'.format(':'.join([host, str(port)])))
    app.run(host=host, port=port, debug=True)