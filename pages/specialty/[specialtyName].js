import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'helpers/fetch';
import styles from './Specialty.module.css';
import PartnerCard from 'components/PartnerCard/PartnerCard';


function Specialty(props) {
    return (
        <>
            <div className={styles.root}>
                <div className={styles.header}><h2>{props.specialty}</h2></div><br/>
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
    return {
        providers: res.data.providers,
        specialty: formattedSpecialty
    }
}

Specialty.propTypes = {
    providers: PropTypes.array,
    specialty: PropTypes.string
}

export default Specialty;