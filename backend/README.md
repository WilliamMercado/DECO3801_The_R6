# Backend

The backend server, built with Flask, handles various core functionalities of the application.

-   `app.py` is the main server entry point and manages APIs for database access, search engine access, and Stable Diffusion backbone access.
-   `search_engine_access.py` contains all methods related to the search engine.
-   `controlnet/` folder contains the Stable Diffusion backbone code and ControlNet extensions.

## Updates:

> **IMPORTANT**: Utterly insecure accessing method to the database has been fixed. Follow the procedure below:

1. Firstly, run `pip install python-dotenv` on your terminal/powershell,etc.
2. Create `.env` file in the `\backend` folder
3. Insert the code `DB_LINK = ` to the `.env` file you created
4. For developers, **copy the link shared privately and paste it after the line you have inserted!**

## Installation & Configuration

> Anaconda (miniconda) is used for virtual environment configuration, please refer to [anaconda's website](https://www.anaconda.com/download/success) for installation details.
>
> For installation of the Stable Diffusion backbone, refer to [the README in controlnet folder](controlnet\README.md).

The list of dependencies used can be found in [requirements.txt](backend/requirements.txt).

### Installation

1.  Create a conda virtual environment and install the dependencies by running the following command in your terminal:

    ```bash
    conda create --name arty_backend python=3.12
    ```
    
2. Activate the conda virtual environment by running `conda activate arty_backend`.
3. Install Pytorch from their [website](https://pytorch.org/get-started/locally/).
4. Install dependencies by running:

   ```bash
   pip install -r backend/requirements.txt
   ```

5. Follow the instruction [here](#updates) to setup `.env` for storing perosnal credentials needed to access UQ Zone.

## Running the Server

1. Make a ssh tunnel to the uqcloud by entering the command
   `ssh -L 3306:localhost:3306 -J your_student_account@remote.labs.eait.uq.edu.au your_student_account@arty.zones.eait.uq.edu.au`.
   Make sure to keep this termianl open. (NOTE: If this does not work you may have to set your ssh key to the EAIT Remote Desktop first!)
2. Create a new terminal at the root directory, activate the conda virtual environment by running `conda activate arty_backend`.
3. From the same terminal, run
   ```bash
   cd backend
   python app.py
   ```
   and keep this terminal open.
6. Now you are set up to run tests for the codebase. Feel free to tweek around the codes here and there.

## Key Services

### Database

Our database is based on PHPMyAdmin and the application interacts with it using SQL Alchemy. The implementation provides a protection from malicious access requests such as SQL injection. The overview of the relational database is summarised in the below image:

<img src = '..\images\db.png' alt = 'database structure'>

### Search Engine

Arty utilises Pinterest API to search images based on the keyword provided by the user. The keyword is handed to the flask application `app.py`, then the keyword or an image is handed over the the module `search_engine_access.py`. If the handed request contains a reference image, a caption is generated using BlipProcessor, then is handed over to the Pinterest API. The returned image from the backend is assigned with a unique id for each image.

Below is the pipeline of the search engine:

<img src = '..\images\search_pipeline.png' alt = 'search engine pipeline'>

### Stable Diffuion Backbone

Arty implements Stable Diffuion 1.5 with ControlNet extensions to provide image generation feature for fast idea visualisation and exploration. Plese find more details in [the README in controlnet folder](controlnet\README.md).

Below is the pipeline of the Stable Diffuion backbone:

<img src = '..\images\sd_pipeline.png' alt = 'stable diffusion backbone pipeline'>

## References

Below are some important resources and documentation related to the tools and models used in the backend:

1. **The BLIP Model**
   - [Hugging Face: BLIP](https://huggingface.co/docs/transformers/en/model_doc/blip)
2. **ControlNet Extension for Stable Diffusion Web UI**:
    - [Mikubill ControlNet GitHub Repository](https://github.com/Mikubill/sd-webui-controlnet)
3. **Flask Documentation**:
    - [Flask Official Documentation](https://flask.palletsprojects.com/en/3.0.x/)
4. **Flask-SQLAlchemy Documentation**:
    - [Flask-SQLAlchemy Official Documentation](https://flask-sqlalchemy.readthedocs.io/en/3.1.x/)
5. **Stable Diffusion v1.5**:
    - [Hugging Face: Stable Diffusion v1.5](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)
6. **Stable Diffusion Web UI**:
    - [AUTOMATIC1111 GitHub Repository](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
