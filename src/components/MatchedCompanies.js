import React from 'react'

const MatchedCompanies = ({ matches, selectCompany }) => {
  return (
    <div>
      {!!matches &&
        matches.map((company, index) => (
          <p key={`match-${index}`} onClick={() => selectCompany(company)}>
            {company.name} | {company.symbol}
          </p>
        ))}
    </div>
  )
}

export default MatchedCompanies
