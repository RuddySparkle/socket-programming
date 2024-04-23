import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function CustomIcon({ onClickHandler, faIcon, colorNormal, colorHover, size }) {
    const [hover, setHover] = useState(false);

    return (
        <FontAwesomeIcon
            size={size}
            bounce={hover}
            onMouseOver={(e) => (setHover(true), (e.target.style.color = colorHover))}
            onMouseOut={(e) => (setHover(false), (e.target.style.color = colorNormal))}
            icon={faIcon}
            onClick={onClickHandler}
            style={{
                paddingLeft: 5,
                paddingTop: 5,
            }}
        />
    );
}
