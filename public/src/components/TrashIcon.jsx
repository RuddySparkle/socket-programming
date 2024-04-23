import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { useState } from 'react';

export default function TrashIcon({onClickHandler}) {

    const [hover, setHover] = useState(false)

    return (
        <FontAwesomeIcon
            size="lg"
            bounce={hover}
            onMouseOver={(e) => (setHover(true), e.target.style.color = 'red')}
            onMouseOut={(e) => (setHover(false), e.target.style.color = 'black')}
            icon={faTrashCan}
            onClick={onClickHandler}
            style={{
                paddingLeft: 5,
                paddingTop: 5,
            }}
        />
    )
}