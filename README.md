<p align="center">
  <img src = images/banner.png alt = "The R6 banner" width = 80% >
<p>
  
# Arty - Digital Art Assisstant by Team The Ryuto 6

Arty is a productivity tool specifically tailored for digital 2D art illustrators.
It's a platform that allows artists to automate frequent, repetitive, and time-consuming tasks like reference searching, idea organisation and visualisation, while ensuring the creative process remains entirely in artist’s control.

Link to our website hosted on UQ-Zone: [https://arty.uqcloud.net/](https://arty.uqcloud.net/) 

_\*Generative AI and Image searching may not work as our cloud GPU isn't always online._

## Main features

Get a better idea of how our platform works from our explainer video [here](https://youtu.be/8cGWy8hhmNw)!

-   Cross-Platform Compatibility
-   Integrated Reference Searching
-   Generative AI for Visualisation
-   Cross-Device History Syncing
-   Side-by-Side Panel

## Contributors

| Name            | Role                                     |
| --------------- | ---------------------------------------- |
| William Mercado | Team Leader                              |
| Brian Zhang     | Machine Learning Developer               |
| Hongyingzi Lu   | Design Coordinator / Front-End Developer |
| Shan Liu        | Design Coordinator / Front-End Developer |
| Yang Xiao       | Back-End Developer                       |
| Ryuto Hisamoto  | Back-End Developer                       |

# Table of Contents

- [Release History](#release-history)
- [Local Installation and Running](#local-installation-and-running)
  - [Front-end](#front-end)
  - [Flask Server (Back-end)](#flask-server-back-end)
  - [Stable Diffusion Backbone (Back-end)](#stable-diffusion-backbone-back-end)
- [Screenshots and Usage Example](#screenshots-and-usage-example)
- [References](#references)
- [Prompts](#prompts)

## Release History

-   **1.0.0 Final Codebase Realse** _<< Current Version_

    -   Revamped readme structure and content
    -   Improved security measures
    -   Improved front-end visual design and feedback

-   0.4.0 Interim Submission V4

    -   Added bookmarking for searched/generated images
    -   Added support for loading more images
    -   Fixed incorrect API calls

-   0.3.0 Interim Submission V3

    -   Improved file structure
    -   Improved content in readme
    -   Implemented Flask back-end server with database access
    -   Added about page for displaying user info and history
    -   Added inpaint canvas in generator page
    -   Added inpaint with controlnet support in stable diffusion backbone

-   0.2.0 Interim Submission V2

    -   Added Arty icon
    -   Added stable diffusion backbone code
    -   Added image searching support for search engine
    -   Improved front-end page design

-   0.1.0 Interim Submission V1

    -   Added ControlNet test code
    -   Initial version of seach engine
    -   Initial version of front-end

-   0.0.0 Repository Creation
    -   Initial readme written

## Local Installation and Running

### Front-end

#### Installation

1. Download and install Node.js (a JavaScript runtime environment) from their [website](https://nodejs.org/en/download/package-manager).
2. Start a new terminal instance from the project root directory, run `cd frontend` to navigate to frontend's folder.
3. Automatically install the dependencies needed by running `npm install`.

#### Running

1. Start a new terminal instance from the project root directory, run `cd frontend` to navigate to frontend's folder.
2. Run `npm start`, the front-end server will be created at http://localhost:3000.

_\*For more details, please refer to the [front-end README](/frontend/README.md)._

### Flask Server (Back-end)

#### Installation

Python environment configuration:

> **Note**: The list of dependencies used can be found in [`backend/requirements.txt`](/backend/requirements.txt).


1.  Download and install Conda (a Python package/environment management system) from their [website](https://www.anaconda.com/download/success).
2.  Create a conda virtual environment and install the dependencies by running the following command in your terminal:

    ```bash
    conda create --name arty_backend python=3.12
    ```
    
3. Activate the conda virtual environment by running `conda activate arty_backend`.
4. Install Pytorch from their [website](https://pytorch.org/get-started/locally/).
5. Install dependencies by running:

   ```bash
   pip install -r backend/requirements.txt
   ```

Environment variable setup:

1. Navigate to `/backend` folder, create a file named `.env`.
2. Open the `.env` file with a text editor, insert:

    ```
    DB_LINK = <private link to our database>
    ```

    _\*Contact one of our team members to get a private link for testing._

#### Running

1. Make an SSH tunnel to UQ-Zone by entering the command:

    ```bash
    ssh -L 3306:localhost:3306 -J <your_uq_account>@remote.labs.eait.uq.edu.au <your_uq_account>@arty.zones.eait.uq.edu.au
    ```

    Make sure to keep this termianl open.

    _\*If this does not work you may have to set your ssh key to the EAIT Remote Desktop first!_

2. Create a new terminal at the root directory, activate the conda virtual environment by running `conda activate arty_backend`.
3. From the same terminal, run:
    ```bash
    cd backend
    python app.py
    ```
    and keep this terminal open.
4. Now you are set up to run tests for the codebase. Feel free to tweek around the codes here and there.

_\*For more details, please refer to the [back-end README](/backend/README.md)._

### Stable Diffusion Backbone (Back-end)

#### Installation

Download models here:

-   [Stable Diffusion 1.5 (v1-5-pruned.ckpt)](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)
-   [SD1.5 ControlNet models (all of them)](https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main)

Installing stable-diffusion-webui:

> **Note**: The `controlnet` folder contains a copy of stable-diffusion-webui with the ControlNet extension pre-installed. If you encounter any issues during installation following the steps below, please refer to the original installation guide for [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) and [sd-webui-controlnet](https://github.com/Mikubill/sd-webui-controlnet).

1. Run `webui.bat` under `/backend/controlnet` folder.

    _\*The first initialisation will fail as it doesn't have access to the model weights._

2. Copy `v1-5-pruned.ckpt` to `/backend/controlnet/models/Stable-diffusion`, copy the ControlNet model weights to `/backend/controlnet/models/ControlNet`.
3. Run `webui.bat` again, and the stable diffusion backbone server will start.

#### Running

Run `webui.bat` under `/backend/controlnet` folder to start the stable diffusion backbone server.

_\*For more details, please refer to the [controlnet README](/backend/controlnet/README.md)._

## Screenshots and Usage Example

The product is to be used as a side assisstant for artists to search for artwork references.
<p align="center">
  <img src = images/pages.png alt = "screenshots" width = 100% >
<p>
<p align="center">
  Screenshots
<p>
<p align="center">
  <img src = images/ipad_.jpeg alt = "Side-by-Side Usage Example" width = 40% >
<p>
<p align="center">
  Side-by-Side Usage Example
<p>

## References

1. **The BLIP Model**:
   - [Hugging Face: BLIP](https://huggingface.co/docs/transformers/en/model_doc/blip)
2. **ControlNet Extension for Stable Diffusion Web UI**:
    - [Mikubill ControlNet GitHub Repository](https://github.com/Mikubill/sd-webui-controlnet)
3. **Flask Documentation**:
    - [Flask Official Documentation](https://flask.palletsprojects.com/en/3.0.x/)
4. **Flask-SQLAlchemy Documentation**:
    - [Flask-SQLAlchemy Official Documentation](https://flask-sqlalchemy.readthedocs.io/en/3.1.x/)
5. **Printerest**:
    - [Pinterest Website](https://au.pinterest.com/business/hub/)
6. **React 18.3.1**:
    - [React Documentation](https://react.dev/versions)
7. **Stable Diffusion v1.5**:
    - [Hugging Face: Stable Diffusion v1.5](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)
8. **Stable Diffusion Web UI**:
    - [AUTOMATIC1111 GitHub Repository](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
9. **Button**:
    - [Animation Bro](https://codepen.io/animationbro/pen/YzXqzLv)
10. **Icon**:
    - [FlatIcon](https://www.flaticon.com/)

## Prompts
1. **Inpainting Canvas**:
   - Help me create a inpainting canvas.
2. **Comments in CSS files**:
   - Help me add comments in these CSS files. 
3. **Team member Profile**:
   - Can you turn these profile images into oil painting effect? 
