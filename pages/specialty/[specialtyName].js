import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './Specialty.module.css';
import PartnerCard from 'components/PartnerCard/PartnerCard';


function Specialty(props) {
    console.log(props.specialty)
    return (
        <>
            <div className={styles.root}>
                <div className={styles.headerWrapper}>
                    <div className={styles.header}><h2>{props.specialty.fields.specialtyName}</h2></div><br/>
                    <img src={`https:${props.specialty.fields.featuredImage.fields.file.url}`} />
                </div>
                <p className={styles.description}>As you search for specialties on the Prevention Generation, we are working in the background to optimize your search around your zip code--showing those specialists in your neighborhood.  You can then tap on each profile to learn more about the conventional or holistic providers near you.</p>
                {console.log(props.providers)}
                <div className={styles.articleWrapper}>
                    {props.providers.map(partner => {
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
                </div>
            </div>
        </>
    )
}

Specialty.getInitialProps = async (ctx) => {
    const { specialtyName } = ctx.query;
    const formattedSpecialty = specialtyName.replace(/-/g, ' ').replace(/_/g, '/')
    const res = await fetch('get',`/api/providers/specialty?specialty=${formattedSpecialty}`);
    const specialty = await fetch('get', `/api/specialties?name=${formattedSpecialty}`)
    return {
        providers: res.data.providers,
        // specialty: formattedSpecialty,
        specialty: specialty.data.results[0]
    }
}

Specialty.propTypes = {
    providers: PropTypes.array,
    specialty: PropTypes.string
}

export default Specialty;