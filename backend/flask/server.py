from flask import Flask
from flask_restful import Api, Resource, abort, reqparse
from flask_cors import CORS
from therapy_diagnoser import therapy_diagnoser
from fire import find_recommended_link

import tensorflow as tf

physical_devices = tf.config.list_physical_devices('GPU') 
for device in physical_devices:
    tf.config.experimental.set_memory_growth(device, True)
    
    
#FLASK SETUP
app = Flask(__name__)
api = Api(app)
CORS(app)


#THERAPY DIAGNOSER
therapy_diagnoser_post_args = reqparse.RequestParser()
therapy_diagnoser_post_args.add_argument("user_input", help="Please Add Valid Input", required=True, location='form')
therapy_diagnoser_post_args.add_argument("userRatingId", help="Please Add Bearer Token", required=True, location='headers')

my_therapy_diagnoser = therapy_diagnoser()

class therapy_diagnoser(Resource): 
    def post(self):
        
        user_input = therapy_diagnoser_post_args.parse_args()
        category = my_therapy_diagnoser.categorize_problem(user_input['user_input'])
        sentiment = my_therapy_diagnoser.predict_sentiment(user_input['user_input'])
      
        link, unviewed_links = find_recommended_link(category[0], user_input['userRatingId'])
     
        
        return {"category_diagnosis": f"{category[0]}", "sentiment_analysis": f"{sentiment}", "recommendeed_link": f"{link}", "unviewed_links": f"{unviewed_links}"}
    
    def get(self):
        return {"output": "SUCCESS"}


api.add_resource(therapy_diagnoser, '/diagnoser')



if __name__ == "__main__":
    app.run(debug=True, port=3001)