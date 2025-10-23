'use client';

import { useState } from 'react';
import { Check, Star, TrendingUp, Shield, Clock, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import '../dashboard.scss';
import './plans.scss';

export interface InvestmentPlan {
  id: string;
  name: string;
  tier: string;
  minAmount: number;
  maxAmount: number;
  percentage: number;
  color: string;
  features: string[];
  popular?: boolean;
  description: string;
}

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);

  const investmentPlans: InvestmentPlan[] = [
    {
      id: 'bronze',
      name: 'Bronze Plan',
      tier: 'Bronze',
      minAmount: 20,
      maxAmount: 50,
      percentage: 5,
      color: '#CD7F32',
      description: 'Perfect for beginners looking to start their investment journey',
      features: [
        '5% Daily Returns',
        'Minimum $20 Investment',
        'Maximum $50 Investment',
        '24/7 Support',
        'Secure Transactions'
      ]
    },
    {
      id: 'silver',
      name: 'Silver Plan',
      tier: 'Silver',
      minAmount: 51,
      maxAmount: 100,
      percentage: 8,
      color: '#C0C0C0',
      description: 'Ideal for moderate investors seeking steady growth',
      features: [
        '8% Daily Returns',
        'Minimum $51 Investment',
        'Maximum $100 Investment',
        'Priority Support',
        'Advanced Analytics',
        'Risk Management'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      tier: 'Gold',
      minAmount: 101,
      maxAmount: 500,
      percentage: 10,
      color: '#FFD700',
      description: 'Premium plan for serious investors',
      features: [
        '10% Daily Returns',
        'Minimum $101 Investment',
        'Maximum $500 Investment',
        'VIP Support',
        'Personal Account Manager',
        'Advanced Trading Tools',
        'Exclusive Market Insights'
      ],
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum Plan',
      tier: 'Platinum',
      minAmount: 501,
      maxAmount: 5000,
      percentage: 15,
      color: '#E5E4E2',
      description: 'Elite plan for high-value investors',
      features: [
        '15% Daily Returns',
        'Minimum $501 Investment',
        'Maximum $5000 Investment',
        'Dedicated Support Team',
        'Custom Investment Strategy',
        'Real-time Market Alerts',
        'Exclusive Investment Opportunities'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond Plan',
      tier: 'Diamond',
      minAmount: 5001,
      maxAmount: 0, // No upper limit
      percentage: 20,
      color: '#B9F2FF',
      description: 'Ultimate plan for maximum returns',
      features: [
        '20% Daily Returns',
        'Minimum $5001 Investment',
        'No Maximum Limit',
        'White-glove Service',
        'Private Investment Consultations',
        'Exclusive Market Access',
        'Priority Withdrawal Processing',
        'Custom Portfolio Management'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = investmentPlans.find(p => p.id === planId);
    if (plan) {
      setInvestmentAmount(plan.minAmount);
    }
  };

  const calculateReturns = (amount: number, percentage: number) => {
    return (amount * percentage) / 100;
  };

  const selectedPlanData = investmentPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="dashboard-page container-custom">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold text-gradient mb-3">Investment Plans</h1>
        <p className="text-secondary fs-5">
          Choose your investment tier and start earning daily returns
        </p>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-gold card-hover text-center">
            <div className="card-body">
              <TrendingUp size={32} className="text-success mb-2" />
              <h4 className="fw-bold text-gold mb-1">5-20%</h4>
              <p className="text-secondary mb-0">Daily Returns</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover text-center">
            <div className="card-body">
              <Shield size={32} className="text-primary mb-2" />
              <h4 className="fw-bold text-gold mb-1">100%</h4>
              <p className="text-secondary mb-0">Secure</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover text-center">
            <div className="card-body">
              <Clock size={32} className="text-info mb-2" />
              <h4 className="fw-bold text-gold mb-1">24/7</h4>
              <p className="text-secondary mb-0">Support</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover text-center">
            <div className="card-body">
              <DollarSign size={32} className="text-success mb-2" />
              <h4 className="fw-bold text-gold mb-1">$20+</h4>
              <p className="text-secondary mb-0">Minimum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Plans */}
      <div className="row g-4 mb-5">
        {investmentPlans.map((plan) => (
          <div key={plan.id} className="col-lg-4 col-md-6">
            <div 
              className={`card border-gold card-hover h-100 position-relative ${
                selectedPlan === plan.id ? 'selected-plan' : ''
              } ${plan.popular ? 'popular-plan' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
              style={{ cursor: 'pointer' }}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Star size={16} className="me-1" />
                  Most Popular
                </div>
              )}
              
              <div className="card-body text-center">
                <div 
                  className="plan-icon mb-3"
                  style={{ color: plan.color }}
                >
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: `${plan.color}20`,
                      border: `2px solid ${plan.color}`
                    }}
                  >
                    <span className="fw-bold fs-4">{plan.tier.charAt(0)}</span>
                  </div>
                </div>

                <h4 className="fw-bold text-white mb-2">{plan.name}</h4>
                <p className="text-secondary mb-3">{plan.description}</p>

                <div className="mb-4">
                  <div className="display-6 fw-bold text-gold mb-1">
                    {plan.percentage}%
                  </div>
                  <p className="text-secondary mb-0">Daily Returns</p>
                </div>

                <div className="investment-range mb-4">
                  <div className="range-container">
                    <div className="range-header d-flex justify-content-between align-items-center mb-3">
                      <span className="range-title text-white fw-medium">Investment Range</span>
                      <div className="range-percentage" style={{ color: plan.color }}>
                        {plan.percentage}% Daily
                      </div>
                    </div>
                    
                    <div className="range-bar">
                      <div 
                        className="range-fill"
                        style={{ 
                          background: `linear-gradient(90deg, ${plan.color}, ${plan.color}80)`,
                          width: plan.maxAmount > 0 ? '100%' : '100%'
                        }}
                      ></div>
                    </div>
                    
                    <div className="range-labels d-flex justify-content-between mt-3">
                      <div className="range-label">
                        <div className="range-amount text-gold fw-bold">
                          ${plan.minAmount.toLocaleString()}
                        </div>
                        <small className="text-secondary">Minimum</small>
                      </div>
                      
                      <div className="range-center">
                        <div className="range-divider"></div>
                      </div>
                      
                      {plan.maxAmount > 0 ? (
                        <div className="range-label text-end">
                          <div className="range-amount text-gold fw-bold">
                            ${plan.maxAmount.toLocaleString()}
                          </div>
                          <small className="text-secondary">Maximum</small>
                        </div>
                      ) : (
                        <div className="range-label text-end">
                          <div className="range-amount text-gold fw-bold">
                            ∞
                          </div>
                          <small className="text-secondary">No Limit</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="features mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <Check size={16} className="text-success me-2" />
                      <span className="text-white small">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={selectedPlan === plan.id ? "primary" : "outline"}
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Form */}
      {selectedPlanData && (
        <div className="card border-gold card-hover">
          <div className="card-body">
            <h4 className="fw-bold text-white mb-4">
              Invest in {selectedPlanData.name}
            </h4>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="investment-form">
                  <div className="mb-3">
                    <label className="form-label text-white">Investment Amount</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark-custom text-white border-light">$</span>
                      <input
                        type="number"
                        className="form-control bg-dark-custom text-white border-light"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={selectedPlanData.minAmount}
                        max={selectedPlanData.maxAmount || undefined}
                        step="0.01"
                      />
                    </div>
                    <div className="form-text text-secondary">
                      Range: ${selectedPlanData.minAmount.toLocaleString()} - 
                      {selectedPlanData.maxAmount > 0 ? `$${selectedPlanData.maxAmount.toLocaleString()}` : 'No Limit'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">Investment Duration</label>
                    <select className="form-select bg-dark-custom text-white border-light">
                      <option value="30">30 Days</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                      <option value="365">365 Days</option>
                    </select>
                  </div>

                  <Button variant="primary" className="w-100">
                    <DollarSign size={16} className="me-2" />
                    Invest Now
                  </Button>
                </div>
              </div>

              <div className="col-md-6">
                <div className="investment-calculator">
                  <h5 className="fw-bold text-white mb-3">Investment Calculator</h5>
                  
                  <div className="calculation-item d-flex justify-content-between mb-2">
                    <span className="text-secondary">Investment Amount:</span>
                    <span className="text-white">${investmentAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="calculation-item d-flex justify-content-between mb-2">
                    <span className="text-secondary">Daily Return Rate:</span>
                    <span className="text-gold">{selectedPlanData.percentage}%</span>
                  </div>
                  
                  <div className="calculation-item d-flex justify-content-between mb-2">
                    <span className="text-secondary">Daily Earnings:</span>
                    <span className="text-success fw-bold">
                      ${calculateReturns(investmentAmount, selectedPlanData.percentage).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="calculation-item d-flex justify-content-between mb-2">
                    <span className="text-secondary">Monthly Earnings:</span>
                    <span className="text-success fw-bold">
                      ${(calculateReturns(investmentAmount, selectedPlanData.percentage) * 30).toFixed(2)}
                    </span>
                  </div>
                  
                  <hr className="border-light my-3" />
                  
                  <div className="calculation-item d-flex justify-content-between">
                    <span className="text-white fw-bold">Total Return (30 days):</span>
                    <span className="text-gold fw-bold fs-5">
                      ${(investmentAmount + (calculateReturns(investmentAmount, selectedPlanData.percentage) * 30)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="card border-gold card-hover mt-4">
        <div className="card-body">
          <h5 className="fw-bold text-white mb-3">Terms & Conditions</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">Minimum investment period: 30 days</span>
                </li>
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">Returns are calculated daily</span>
                </li>
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">Withdrawals processed within 24 hours</span>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">No hidden fees or charges</span>
                </li>
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">Secure and encrypted transactions</span>
                </li>
                <li className="mb-2">
                  <Check size={16} className="text-success me-2" />
                  <span className="text-secondary">24/7 customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
