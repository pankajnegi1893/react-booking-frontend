import React from 'react';
import './Modal.css';


const modal = props => (
    <div className="modal">
        <header className="modal__header">
            <h1>{props.title}</h1>
        </header>
        <section className="model__content">
            {props.children}
        </section>
        <section className="model__action">
            {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button> }
            {props.canConfirm && <button className="btn" onClick={props.onConfirm}>{props.confirmText}</button> }
        </section>
    </div>
);

export default modal;