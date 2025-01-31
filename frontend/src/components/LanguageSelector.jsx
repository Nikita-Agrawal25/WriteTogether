import React from 'react'
import { LANGUAGE_VERSIONS } from '../constraints'

const languages = Object.entries(LANGUAGE_VERSIONS);

function LanguageSelector({ onSelect, language }) {
  
    return (
        <>
        <select value={language} onChange={(e) => onSelect(e.target.value)}>
            {languages.map(([lang, version]) => (
                <option key={lang} value={lang}>
                    {lang}
                    {version}
                </option>
            ))}
        </select>
        </>
    )
}

export default LanguageSelector;