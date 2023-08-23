import React from 'react';
import '../../App.css';
import { useAuthContext } from '../../context/AuthContext';
import { PayPalButton } from "react-paypal-button-v2";
import { CLIENT_ID } from '../../config';
import { getResourceById } from '../../api';
import { ResourceTypeEnum } from '../../models/ResourceTypeEnum';

interface Props {
    planID: string;
}

const Payment: React.FC<Props> = ({ planID }) => {
    const { accessToken } = useAuthContext()
    const createSubscription = async (data, actions) => {
        return await actions.subscription.create({
            plan_id: planID,
            auto_renewal: false
        });
    }
    const onApprove = async (data, actions) => {
        try {
            const subscription = await actions.subscription.get()
            await getResourceById(accessToken, ResourceTypeEnum.GetPaymentVerification, subscription.id)

            return subscription
        } catch (error) {
            console.log(error)
        }
    }
    const onError = (e) => {
        console.log("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", e)
    }
    return (
        <>
            <PayPalButton
                options={{
                    clientId: CLIENT_ID,
                    vault: true
                }}
                createSubscription={createSubscription}
                onApprove={onApprove}
                onError={onError}
                style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'pill',
                    label: 'paypal'
                }}
            />
        </>
    );
}

export default Payment;
