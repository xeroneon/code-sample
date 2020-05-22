import React from 'react';
import styles from './[tag]/Article.module.css';
import Head from 'next/head';
import ReactPlayer from 'react-player';

function Article() {

    return (
        <>
            <Head>
                <title>What is the prevention generation?</title>
                <meta property="og:title" content='What is the prevention generation?' />
                <meta property="og:url" content={`${process.env.DOMAIN_NAME}/what-is-prevention-generation`} />
                <meta property="og:image" content={`/images/welcome-image.png`} />
                <meta property="og:image:secure_url" content={`/images/welcome-image.png`} />
                <meta property="og:description" content="What is the prevention generation" />
                <meta property="og:type" content="article" />
                <meta property="article:author" content="prevention generation" />
            </Head>
            <div className={styles.core}>
                <div style={{width: '100%', height: '550px'}}>
                    <ReactPlayer
                        controls={true}
                        url='https://vimeo.com/417673496'
                        width='100%'
                        height='100%'
                    />
                </div>
                <div className={styles.articleBody} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <h1>What is the Prevention Generation?</h1>
                    <p className={styles.paragraph}>Prevention Generation(PG) is a member-based community movement that has one primary goal: <i>to reverse the trend of chronic illness impacting six in ten Americans</i>. PG provides our audience access to medically reviewed content they can use to develop (and live) a healthier lifestyle.</p>

                    <h1>What are you Preventing?</h1>
                    <p className={styles.paragraph}>It isn’t what WE are preventing. It is what YOU, as a member of PG, have the potential to prevent: <i>chronic disease</i>. Did you know, <a href="https://www.cdc.gov/chronicdisease/about/index.htm" target="_blank" rel="noopener noreferrer">according to the Center for Diseases Control</a>, the leading causes of death and disability in the US are heart disease, cancer and diabetes? The foundational cause of these diseases includes poor nutrition, lack of physical activity, poor sleep, tobacco use and alcohol intake--All of these disease processes can be positively impacted through lifestyle choices.</p>

                    <h1>How does it work?</h1>
                    <p className={styles.paragraph}>
                        <ol style={{listStyleType: 'decimal', marginLeft: '30px'}}>
                            <li>Tap sign up</li>
                            <li>Put in your name, location &amp; email</li>
                            <li>Pick the “health tags” you want to follow</li>
                        </ol>
                        Then viola, your home screen features all of the posts, articles, and videos we have created, which have been tagged with the health tags that you follow.  Yep, it is that easy.
                    </p>

                    <h1>How is this content different?</h1>
                    <p className={styles.paragraph}>Every post, blog or video is medically reviewed by a holistic or conventional physician creating a trustworthy and reliable resource.</p>

                    <h1>What is a health tag?</h1>
                    <p className={styles.paragraph}>A health tag is a topic or theme aligned with a piece of content. You choose the health tags important to you and that you want to follow. These organizational “tags”, containing PG’s physician reviewed material, now becomes your “personalized feed” for requested information. This is exactly what makes Prevention Generation unique and special-moving you from ”click &amp; search” to “find &amp; feed.”</p>

                    <h1>What is the difference between a primary &amp; secondary health tag?</h1>
                    <p className={styles.paragraph}>Whenever a new piece of content is added to the system, anyone following the primary or secondary tags aligned with the material will see the content in their personalized feed. For example, a post with a primary tag of weight loss may be focused on meal planning. A secondary tag aligning with weight loss may be heart health. Heart health contains information on heart-healthy Salmon meals. If I follow either of those tags, this post will show up in my feed.</p>

                    <h1>Who is this for?</h1>
                    <p className={styles.paragraph}>We call the Prevention Generation <i>“pan generational.”</i> Our experts know improving lifestyle choices, at any age, can and will prevent chronic disease development OR if disease already exists, improve disease management. Eating healthier, getting regular exercise and sleeping better are the foundation of a preventable lifestyle. Creating a healthier you is good both for you and your loved ones!</p>

                    <h1>So who is behind this idea?</h1>
                    <p className={styles.paragraph}>We created this by mashing together a digital media executive, software developer, Chiropractic Physician, an SEO expert, a teacher and an Osteopathic Physician! Yep, it is a strange brew of people, but it gave us the ability to bring multiple points of view into creating something we are all 100% passionate about; helping people live healthier lives by sharing trustworthy health content that is personalized for you, by you!</p>

                    <h1>How do I stay up to date?</h1>
                    <p className={styles.paragraph}>Prevention Daily is our “alert” style daily email (well, right now it is 3 times a week--we are still small). This features the top trending post in the platform with a link to read or view the content.</p>

                    <h1>Is this a new kind of website?</h1>
                    <p className={styles.paragraph}>Yes, it is. We built this from “the ground up.” PG’s website was created with a passion for alleviating the standard, frustratingly inefficient, and wasteful search and clicking practice found on all health &amp; wellness websites. By the way, did we mention all those annoying ads on those same websites which follow you everywhere? Prevention Generation is the ONLY “feed &amp; follow” platform out there! You pick what you are interested in (health tags) and send you medically reviewed, trustworthy health content (personalized health feed)! Oh, and there are no annoying ads following you either! (you’re welcome :-)</p>

                    <h1>How do you make money--there are no ads?</h1>
                    <p className={styles.paragraph}>We love this question--because it is at the heart of why we created this environment. We make money in one of two ways. (1) Doctors individually or health systems as an aggregate of doctors join the Prevention Generation as a way to stay engaged with existing patients or let new patients find them--all for a low monthly payment and (2) healthy lifestyle brands can join and create a profile page with the ability to showcase their products and services to our Prevention Generation Community.(They are not allowed to run ads--share awesome content and promotions through their profile page and their posts!)</p>

                    <h1>What is feed &amp; follow?</h1>
                    <p className={styles.paragraph}>You will notice the ability to “follow” health tags, physicians, wellness professionals and healthy lifestyle brands in the platform. “Following” enables all of the content any professional posts to show up in your personalized health “feed.” This is a unique, unprecedented opportunity to continually engage with your physician, receive medically reviewed information specific to your needs and receive content updates and promotion information important to you. This, like a fine wine, will become better and more robust over time!</p>

                    <h1>Can I be a contributor or give feedback?</h1>
                    <p className={styles.paragraph}>If you have any comments, ideas on new health tags or requests for specific types of content, please drop us a line <a href='mailto:info@preventiongeneration.com' target="_blank" rel="noopener noreferrer">hello@preventiongeneration.com</a>. Oh, and if you want to be a contributor on the platform (and have experience in any of our health tag categories) we would love to chat.</p>

                    <h1>How can I join Prevention Generation as a Health Provider?</h1>
                    <p className={styles.paragraph}>In order to ensure that all providers in the Prevention Generation Network are held to a little higher standard, we require that providers be credentialed by our parent company AHWA. Please click <a href='https://www.ahwa.com/membership' target='_blank' rel="noopener noreferrer">here</a> to apply as a provider.</p>

                    <h1>How can I join Prevention Generation as a Health Supplier?</h1>
                    <p className={styles.paragraph}>If you are a business or employer and would like to join the Prevention Generation movement, please email <a href='mailto:info@preventiongeneration.com' target="_blank" rel="noopener noreferrer">info@preventiongeneration.com</a>.</p>

                    <h1>Are you guys hiring?</h1>
                    <p className={styles.paragraph}>We are always looking for great people to represent PG--if you are looking for your path in life and are passionate about health &amp; wellness, we would like to hear from you!  We need passionate and dedicated people to promote and attract health and wellness suppliers, health systems or individual physicians/wellness professionals into the platform. Drop us a line at <a href='careers@ahwa.com' target="_blank" rel="noopener noreferrer">careers@ahwa.com</a></p>
                </div>
            </div>

            <style jsx>{`
                i {
                    font-style: italic;
                }    
            `}</style>
        </>
    )
}

export default Article;