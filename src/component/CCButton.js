import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const propTypes = {
    player: PropTypes.object,
    className: PropTypes.string,
};

export default class CCButton extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
    }

    render() {
        const { player, className } = this.props;
        const { currentSrc } = player;

        return (
            <a
                ref={
                    (c) => {
                        this.button = c;
                    }
                }
                className={classNames(className, {
                    'video-react-control': true,
                    'video-react-button': true,
                })}
                href={currentSrc}
                download
                style={{
                    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM3N0ZBOEY5M0Y4NjExRTg5NjhERUM2NTY2MEREQkUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM3N0ZBOEZBM0Y4NjExRTg5NjhERUM2NTY2MEREQkUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Qzc3RkE4RjczRjg2MTFFODk2OERFQzY1NjYwRERCRTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Qzc3RkE4RjgzRjg2MTFFODk2OERFQzY1NjYwRERCRTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7rgc16AAABT0lEQVR42ozTzytEURTA8feGemEhpJHUNFEWk4aVjYUtZWnHYsrKyt7GwlZZ2yl/g4VYW43Jj0lIpmRpMJuRYa7veZ2b46Kc+tR9957Oe++882LnXBTECPK6ruE++hmdKKAPDVyimZ5IQdWLHTy5r3jBHrImbw4naJu8K5TSh9OkBAcm4V2L+aiiB7N4M/vP7nus+YIlsyl3L2IIW2hiFwMoa4483bo++TRuUcOyL7hvCs6b18ugoOtJk1M2OSKvN0yb24GcNvtVG+yjjaqux83+afCR7vwiExzE0d8R/ydPCn7gQa8TTAQ5Mzom12ZvKsgZRtGOzarpz5n2S3qyonsVjOmZjw0MYhRHaGHTF5SRODbJcvhorg/RhYVgTOo6BT6W7JfK6hA3TIIM+Ta6Td4iLoLCFT8d8S+/Xs78ejemvzYS/fX6Ucc5WnLwKcAAOFUMNmc6uFEAAAAASUVORK5CYII=)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
                tabIndex="0"
                onClick={this.handleClick}
            />
        );
    }
}

CCButton.propTypes = propTypes;

