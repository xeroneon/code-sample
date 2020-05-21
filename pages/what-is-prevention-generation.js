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
                    <p className={styles.paragraph}>Prevention Generation is a member-based community movement that has one primary goal: to reverse the trend of chronic illness impacting six in ten Americans by giving our audience access to medically reviewed content they can use to live a healthier lifestyle.</p>
                    <h1>What are you Preventing?</h1>
                    <p className={styles.paragraph}>It isn’t what we are preventing, it is what our members have the potential to prevent: chronic diseases.  Did you know, according to the Center for Diseases Control, that the leading causes of death and disability in the US are heart diseases, cancer, and diabetes?  And the leading causes of these diseases include poor nutrition, use of tobacco, lack of physical activity, and alcohol intake--all of which we can control through lifestyle decisions.</p>
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
                    <p className={styles.paragraph}>Every post, blog, or video is medically reviewed by a holistic or conventional doctor, so you know that the content here is trustworthy.</p>
                    <h1>What is a health tag?</h1>
                    <p className={styles.paragraph}>A health tag is a topic or theme aligned with a piece of content in the Prevention Generation--as you choose the health tags you want to follow, the “tags” become a way to organize all of our articles, posts, and videos so that we can personalize them for your feed. </p>
                    <h1>What is the difference between a primary &amp; secondary health tag?</h1>
                    <p className={styles.paragraph}>Whenever a new piece of content is added to the system, anyone following the primary or secondary tags aligned with the article post or video will see the content in their personalized feed.  For example, a post with a primary tag of weight loss may be focused on meal planning, and a secondary tag aligned with this post may be heart health as one of the meals is Salmon.  If I follow either of those tags, this post will show up in my feed.</p>
                    <h1>Who is this for?</h1>
                    <p className={styles.paragraph}>We call the Prevention Generation “pan generational,” because we think lifestyle choices that help prevent chronic illness can start at any age.  Eating better, sleeping better, taking care of your heart, your skin, your brain, getting exercise and more all enable a preventative lifestyle, and that is good for everyone!</p>
                    <h1>So who is behind this idea?</h1>
                    <p className={styles.paragraph}>We created this by mashing together a digital media executive, software developer, ChiropracticPhysician, an SEO expert, a teacher, and an Osteopathic Physician!  Yep, it is a strange brew ofpeople, but it gave us the ability to bring multiple points of view into creating something we are all 100% passionate about; helping people live healthier lives by sharing awesome health content that is personalized for you, by you!</p>
                    <h1>How do I stay up to date?</h1>
                    <p className={styles.paragraph}>Prevention Daily is our “alert” style daily email (well, right now it is 3 times a week--we are still small).  This features the top trending post in the platform with a link to read or view the content.</p>
                    <h1>Is this a new kind of website?</h1>
                    <p className={styles.paragraph}>Yep, it is.  We built this from scratch based on a passion for getting away from the crazy searching and clicking; we found ourselves doing on every other health and wellness website, as ads followed us everywhere.  So we went from “search &amp; click” to “feed &amp; follow” with Prevention Generation--you pick what you are interested in (health tags to follow), and we send all of that content to you (personalized health feed)!  Oh, and there are no annoying ads following you around the site (you’re welcome :-)</p>
                    <h1>How do you make money--there are no ads?</h1>
                    <p className={styles.paragraph}>We love this question--because it is at the heart of why we created this environment.  We make money in one of two ways (1) Doctors individually or health systems as an aggregate of doctors can join the Prevention Generation as a way to stay engaged with existing patients, or let new patients find them for a low monthly payment and (2) healthy lifestyle brands can join with a profile page and the ability to showcase their products and services to our Prevention Generation Community (but they are not allowed to run ads--just share awesome content and promotions through their profile and their posts!)</p>
                    <h1>What is feed &amp; follow?</h1>
                    <p className={styles.paragraph}>You will notice the ability to “follow” health tags, doctors, wellness professionals, and healthy lifestyle brands in the platform.  This enables all of the content they post to show up in your personalized health “feed.”  Pretty cool opportunity to stay close to your doctor, get medically reviewed content based on the topics you are interested in, and get updates and promotions from awesome bands.  And this will only get cooler over time!</p>
                    <h1>Can I be a contributor or give feedback?</h1>
                    <p className={styles.paragraph}>If you have any comments, ideas on new health tags or requests for specific types of content, please drop us a line (email).  Oh, and if you want to be a contributor on the platform (and have experience in any of our health tag categories), we would love to chat.</p>
                    <h1>How can I join Prevention Generation as a Health Provider?</h1>
                    <p className={styles.paragraph}>In order to ensure that all providers in the Prevention Generation Network are held to a little higher standard, we require that providers be credentialed by our parent company AHWA.  Please <a href='https://www.ahwa.com/membership' target='_blank' rel="noopener noreferrer">click here</a> to apply as a provider.</p>
                    <h1>How can I join Prevention Generation as a Health Supplier?</h1>
                    <p className={styles.paragraph}>If you are a business or employer and would like to join the Prevention Generation movement, please email <a href='mailto:info@preventiongeneration.com'>info@preventiongeneration.com</a>.</p>
                    <h1>Are you guys hiring?</h1>
                    <p className={styles.paragraph}>We are always looking for great people to represent PG. If you are looking for your next gig and would like to sell health and wellness suppliers, health systems, or individual doctors/wellness professionals onto the platform, we would love the help!  Drop us a line at careers@ahwa.com</p>
                </div>
            </div>
        </>
    )
}

export default Article;