import React from 'react';
import Container from '../Global/Container';
import Title from '../Global/Title';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import CheckIcon from '../../../check-icon';
import Subtitle from '../Global/Subtitle';


const plans = [
  {
    name: "Awaken",
    price: "$0",
    period: "month",
    features: [
      "10 transactions/month",
      "Basic invoicing",
      "Email support",
      "Mobile app access"
    ],
    popular: false,
  },
  {
    name: "Ascend",
    price: "$29",
    period: "month",
    features: [
      "Unlimited transactions",
      "Advanced invoicing",
      "Priority support",
      "Multi-currency",
      "API access"
    ],
    popular: true,
  },
  {
    name: "Actualize",
    price: "$99",
    period: "month",
    features: [
      "All Pro features",
      "White-label solution",
      "Dedicated manager",
      "Custom integrations"
    ],
    popular: false,
  },
];

export default function Pricing({ title = 'Learning Tiers', subtitle = 'Progress through structured tiers designed to build your Islamic knowledge systematically.' }: { title?: string, subtitle?: string }) {
    return (
        <Container className='pb-20 max-w-7xl'>
            <Title className='text-center pb-3'>{title}</Title>
            <Subtitle className='pb-8 text-center max-w-3xl mx-auto'>{subtitle}</Subtitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-10">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`  relative border-2   ${plan.popular ? "shadow-offset-8 border-primary" : "shadow-custom-offset border-black"} rounded-2xl  bg-white xl:px-5 max-h-max my-auto w-full max-w-[300px] md:max-w-[350px] mx-auto`}
                    >
                        <CardHeader className="pb-4 px-3 lg:px-6">
                            <Title className='pb-6 font-semibold text-foreground'>{plan.name}</Title>
                            <div className="mb-4 flex items-end ">
                                <Title className='font-semibold text-foreground'>{plan.price}</Title>
                                <p className="text-sm  pl-1 text-gray-900 pb-1">/{plan.period}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0 px-3 lg:px-6">
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-sm text-gray-800 gap-2">
                                        <CheckIcon />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full rounded-lg font-medium ${plan.popular && 'mt-10'}`}
                                size="lg"
                            >
                                Get Started
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Container>
    );
}