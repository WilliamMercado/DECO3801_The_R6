import React from "react";
import "../styles/About.css";

// About Us page component
export default function About() {
    return (
        <>
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        
            {/* About Us Section */}
            <div className="about-us-block" style={{ backgroundImage: 'url(/images/about_bg.JPG)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* Main heading and description */}
                            <h1 className="heading-nice-to-meet">Nice to meet u</h1>
                            <p className="paragraph-introduction">
                                We are thrilled to introduce ourselves and share our passion for AI and art.
                            </p>
                            {/* 'Learn More' button that links to the 'What We Do' section */}
                            <a href="#what-we-do" className="btn-learn-more">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* What We Do Section */}
            <div id="what-we-do" className="what-we-do-block">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-lg-6">
                            <div className="section_heading text-center wow fadeInUp" 
                                data-wow-delay="0.2s">
                                <h2>What We Do</h2>
                                {/* Illustration image */}
                                <img src="images/what we do.png" alt="Illustration" className="illustration"/>
                                
                                {/* Paragraphs describing the platform's functionalities */}
                                <p className="text-paragraph">
                                    Our platform is dedicated to providing innovative AI-driven tools for artists.
                                </p>
                                <p className="text-paragraph">
                                    We offer smart image generation, advanced style recognition, and seamless integration to enhance creativity and productivity.
                                </p>
                                <p className="text-paragraph">
                                    By leveraging cutting-edge technology, we aim to support artists in exploring new artistic possibilities and bringing their creative visions to life.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What You Can Do Section */}
            <div className="what-you-can-do-block">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-lg-6">
                            <div className="section_heading text-center wow fadeInUp" 
                                data-wow-delay="0.2s">
                                <h2>What You Can Do</h2>
                                {/* Illustration image */}
                                <img src="images/what you can do.png" alt="Illustration" className="illustration"/>
                                {/* Functionality descriptions for users */}
                                <p className="text-paragraph">
                                - Search for References: Enter text prompts to search for reference images that match your creative needs.
                                </p>
                                <p className="text-paragraph">
                                - Real-Time Reference Generation: Generate and arrange assets by inputting text or images to create reference images that align with your creative intentions.
                                </p>
                                <p className="text-paragraph">
                                - Cross-Device Usage: Use the software on desktop, laptop, or iPad to assist in their creative process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who We Are Section */}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-lg-6">
                        <div className="section_heading text-center wow fadeInUp" 
                            data-wow-delay="0.2s" >
                            <h2>Who We <span> Are</span></h2>
                            {/* Descriptions about the team */}
                            <p className="who-we-are">
                            A team of innovators pushing the boundaries of art and technology.
                            </p>
                            <p className="who-we-are">
                            Our mission is to blend creativity with AI to empower artists and inspire new forms of expression.
                            </p>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* Team Members Section */}
                    {/* Each team member has a profile card with social links */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                {/* Profile picture */}
                                <img src="images/william.JPG" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/wmercado0"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/wmercado0"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/wmercado0"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                {/* Member's name and role */}
                                <h6>William Mercado</h6>
                                <p className="designation">Team Leader & Search Engine Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional team member profiles follow the same structure */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                <img src="images/brian.JPG" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/z.pengfei_"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/z.pengfei_"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/z.pengfei_"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                {/* Member's name and role */}
                                <h6>Brian Zhang</h6>
                                <p className="designation">Stable Diffusion Model Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Repeat for the other members */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                <img src="images/ryuto.PNG" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/hisattohisahisa"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/hisattohisahisa"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/hisattohisahisa"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                <h6>Ryuto Hisamoto</h6>
                                <p className="designation">API Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Repeat for the other members */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                <img src="images/yang.JPG" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/y.a.n.g_official"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/y.a.n.g_official"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/y.a.n.g_official"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                {/* Member's name and role */}
                                <h6>Yang Xiao</h6>
                                <p className="designation">Backend Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Repeat for the other members */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                <img src="images/shan.jpeg" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/cecili_l"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/cecili_l"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/cecili_l"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                {/* Member's name and role */}
                                <h6>Shan Liu</h6>
                                <p className="designation">Frontend Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Repeat for the other members */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="single_advisor_profile wow fadeInUp" 
                            data-wow-delay="0.2s">
                            <div className="advisor_thumb">
                                <img src="images/hongyingzi.jpg" alt="" />
                                <div className="social-info">
                                    {/* Social media icons */}
                                    <a href="https://www.instagram.com/olivialuuuuuu"><i className="fa fa-instagram"></i></a>
                                    <a href="https://www.instagram.com/olivialuuuuuu"><i className="fa fa-twitter"></i></a>
                                    <a href="https://www.instagram.com/olivialuuuuuu"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="single_advisor_details_info">
                                {/* Member's name and role */}
                                <h6>Hongyingzi Lu</h6>
                                <p className="designation">UI Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
