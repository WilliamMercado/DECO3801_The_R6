"""
This file contains the API of the application. All methods handle requests and JSON files from the frontend and
 return response and a JSON file.
"""
import os

from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from transformers import BlipProcessor, BlipForConditionalGeneration

from controlnet.sd_backbone import StableDiffusionBackBone

from database import db

app = Flask(__name__, static_folder='static')
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key')  # Use an environment variable your_random_secret_key

load_dotenv()

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_LINK')
# Folder to temporarily save generation results
GENERATION_FOLDER = os.path.join('static', 'generations')
app.config['GENERATION_FOLDER'] = GENERATION_FOLDER

# Make sure the folder exists
if not os.path.exists(app.config['GENERATION_FOLDER']):
    os.makedirs(GENERATION_FOLDER, exist_ok=True)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialising blip
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", cache_dir='blip_weights')
blip = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base", cache_dir='blip_weights')

# Initialising sdbackbone
webui_url = 'https://civil-tahr-stirring.ngrok-free.app'
bb = StableDiffusionBackBone()

db.init_app(app)

if __name__ == '__main__':

    import key_functionalities
    app.register_blueprint(key_functionalities.bp)

    from db_functionalities import bp
    app.register_blueprint(bp)

    with app.app_context():

        app.run(host='127.0.0.1', port=5000, debug=True)
