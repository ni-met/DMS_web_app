import {HTMLAttributes} from 'react'

export interface ErrorFeedbackProps extends HTMLAttributes<HTMLDivElement> {
    showMessage: boolean
    feedback: string
}

function ErrorFeedback({
                           className = 'error',
                           showMessage,
                           feedback,
                           ...rest
                       }: ErrorFeedbackProps) {
    return (
        <>
            {showMessage ? (
                <div className={className} {...rest}>
                    {feedback}
                </div>
            ) : null}
        </>
    )
};

export default ErrorFeedback;
