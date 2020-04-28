import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'contexts/UserProvider';
import Link from 'next/link';
import Tag from 'components/Tag/Tag';
import Carousel from 'components/Carousel/Carousel';
import fetch from 'helpers/fetch';
import PartnerCard from 'components/PartnerCard/PartnerCard';
import ArticleCard from 'components/ArticleCard/ArticleCard';


function Account() {
    const { user } = useContext(UserContext);
    const [ following, setFollowing ] = useState([])
    const [ favorites, setFavorites ] = useState([])
    useEffect(() => {
        if(user) {
            getPartners();
            getFavorites();
        }
    }, [user])
    
    function getPartners() {
        fetch('get', `/api/users/following?email=${user.email}`).then(res => {
            setFollowing(res.data.following)
        }).catch(e => console.log(e))
    }
    function getFavorites() {
        fetch('get', `/api/articles/favorites?email=${user.email}`).then(res => {
            setFavorites(res.data.articles);
            console.log(res.data.articles)
        }).catch(e => console.log(e))
    }
    return (
        <>
            <div className='wrapper'>
                <div className='userCard'>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src={user?.image} />
                        { user?.accountType !== 'supplier' && <p>{user?.name} {user?.lastname}</p>}
                        { user?.accountType === 'supplier' && <p>{user?.companyName}</p>}
                    </div>
                    <Link href='/edit-profile'>
                        <div className='edit'>edit profile</div>
                    </Link>
                </div>
                <div style={{maxWidth: '300px', display: 'flex', justifyContent: 'center', flexWrap:'wrap', marginBottom: '30px'}}>
                    { user?.personalTags.map(tag => <Tag link key={tag} name={tag} />)}
                </div>
            </div>

            { user && favorites.length > 0 && <Carousel header={[`${user.name}'s`, <span key="user"> Favorites </span>,<br key="cn"/> ]}>
                {/* {userArticles.length === 0 && <div id="noArticles"><h4>No Articles, Try following a tag or Health Partner</h4></div>} */}
                {favorites.map(article => {
                    const authorName = article.author.accountType === 'provider' ? [article.author.name, article.author.lastname].map(name => name.toLowerCase().replace(/\s/g, '_')).join('-') : article.author.name.replace(/\s/g, '-');
                    return <ArticleCard 
                        key={article.sys.id}
                        id={article.sys.id}
                        authorImage={article.author.image}
                        title={article.fields.title}
                        featuredImage={`https:${article.fields.featuredImage.fields.file.url}`}
                        slug={article.fields.slug}
                        primaryTag={article.fields.primaryTag}
                        tags={article.fields.tags}
                        authorName={authorName}
                        authorCity={article.author.city}
                        sponsor={article.sponsor}
                        type={article.author.accountType}
                        companyName={article.author.companyName}
                    />
                })}
            </Carousel> }

            {following.length > 0 && <Carousel header={[`${user.name}'s `, <span key="partners"> Health </span>, <br key="xcnmbv"/>, "partners" ]}>
                {following.map(partner => {
                    return <PartnerCard 
                        key={partner._id}
                        image={partner.image}
                        name={partner.name}
                        lastname={partner.lastname}
                        tags={partner.tags}
                        city={partner.city}
                        lat={partner.lat}
                        lng={partner.lng}
                        type={partner.accountType}
                        companyName={partner.companyName}
                        bio={partner.bio}
                        specialty={partner?.specialty?.name}
                    />
                })}
            </Carousel> }
            <style jsx>{
                `
                .wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .userCard {
                    width: 300px;
                    height: 300px;
                    // border: .5px solid #143968;
                    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
                    -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
                    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
                    margin: 30px;
                    margin-bottom: 10px;
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    border-radius: 2px;
                }
                .userCard img {
                    margin: 10px;
                    margin-bottom: 20px;
                    border-radius: 1000px;
                    width: 150px;
                }
                .edit {
                    width: 300px;
                    align-self: end;
                    background: #B8CEDF;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-transform: uppercase;
                    box-sizing: border-box;
                    color: #143968;
                    font-weight: bold;
                    border-radius: 0 0 2px 2px;
                }
                .edit:hover {
                    cursor: pointer;
                }
                `
            }</style>
        </>
    )
}

export default Account;