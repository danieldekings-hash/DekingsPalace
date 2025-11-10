'use client';

import { useEffect, useState } from 'react';
import { Check, Star, TrendingUp, Shield, Clock, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import auth from '@/lib/auth';
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

type PlanApiItem = {
  id?: unknown;
  name?: unknown;
  tier?: unknown;
  minAmount?: unknown;
  min?: unknown;
  maxAmount?: unknown;
  max?: unknown;
  percentage?: unknown;
  rate?: unknown;
  color?: unknown;
  features?: unknown;
  popular?: unknown;
  description?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [plans, setPlans] = useState<InvestmentPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [investError, setInvestError] = useState<string | null>(null);
  const [investSuccess, setInvestSuccess] = useState<{ reference?: string; investmentId?: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadPlans = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const json: unknown = await api.getPlans(undefined, controller.signal);
        // Support either { data: [...] } or direct array
        const raw = Array.isArray(json)
          ? json
          : (isObject(json) && Array.isArray((json as { data?: unknown }).data) ? (json as { data: unknown[] }).data : []);

        const mapped: InvestmentPlan[] = (Array.isArray(raw) ? raw : [])
          .map((item) => item as PlanApiItem)
          .map((p) => {
            const id = isObject(p) && (typeof p.id === 'string' || typeof p.id === 'number')
              ? String(p.id)
              : isObject(p) && (typeof p.tier === 'string' || typeof p.name === 'string')
                ? String((p.tier as string) ?? (p.name as string))
                : crypto.randomUUID();
            const name = isObject(p) && typeof p.name === 'string'
              ? p.name
              : isObject(p) && typeof p.tier === 'string'
                ? p.tier
                : 'Plan';
            const tier = isObject(p) && typeof p.tier === 'string' ? p.tier : name;
            const minAmount = Number((isObject(p) && (p.minAmount ?? p.min)) ?? 0);
            const maxAmount = Number((isObject(p) && (p.maxAmount ?? p.max)) ?? 0);
            const percentage = Number((isObject(p) && (p.percentage ?? p.rate)) ?? 0);
            const color = isObject(p) && typeof p.color === 'string' ? p.color : '#FFD700';
            const features = (isObject(p) && Array.isArray(p.features) ? p.features : []) as unknown[];
            const featureStrings = features.filter((f) => typeof f === 'string') as string[];
            const finalFeatures = featureStrings.length > 0 ? featureStrings : [
              `${percentage}% Monthly Returns`,
              `Minimum $${minAmount}`,
              `${maxAmount > 0 ? `Maximum $${maxAmount}` : 'No Maximum Limit'}`
            ];
            const popular = Boolean(isObject(p) ? p.popular : false);
            const description = isObject(p) && typeof p.description === 'string'
              ? p.description
              : 'Attractive monthly returns with secure management';

            return {
              id,
              name,
              tier,
              minAmount,
              maxAmount,
              percentage,
              color,
              features: finalFeatures,
              popular,
              description
            } as InvestmentPlan;
          });
        setPlans(mapped);
      } catch (err: unknown) {
        const abort =
          (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError') ||
          (isObject(err) && 'name' in err && (err as { name?: unknown }).name === 'AbortError');
        if (abort) {
          // Ignore aborts caused by component unmount/refresh/strict-mode re-renders
          return;
        }
        const message = isObject(err) && typeof (err as { message?: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Unable to load plans';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
    return () => controller.abort();
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = (plans ?? []).find(p => p.id === planId);
    if (plan) {
      setInvestmentAmount(plan.minAmount);
    }
  };

  const calculateReturns = (amount: number, percentage: number) => {
    return (amount * percentage) / 100;
  };

  const selectedPlanData = (plans ?? []).find(plan => plan.id === selectedPlan);

  const getAuthToken = () => auth.getToken() || undefined;

  const min = selectedPlanData ? selectedPlanData.minAmount : 0;
  const max = selectedPlanData ? selectedPlanData.maxAmount : 0;
  const withinMax = max === 0 || investmentAmount <= max;
  const canInvest = !!selectedPlanData && investmentAmount >= min && withinMax;

  const toDisplayString = (value: unknown) => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const onInvest = async () => {
    if (!selectedPlanData || !canInvest) return;
    setInvestError(null);
    setInvestSuccess(null);
    setIsInvesting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setInvestError('Authentication required');
        return;
      }
      const payload = {
        plan: (selectedPlanData.tier || selectedPlanData.name || '').toLowerCase(),
        amount: investmentAmount,
        currency: 'USDT'
      };
      const res: unknown = await api.createInvestment(payload, token);
      const data = (isObject(res) && 'data' in res) ? (res as { data: unknown }).data : res;
      setInvestSuccess({
        reference: (isObject(data) && 'reference' in data && typeof (data as { reference?: unknown }).reference === 'string')
          ? (data as { reference: string }).reference
          : undefined,
        investmentId: (isObject(data) && ('investmentId' in data || 'id' in data))
          ? String((data as { investmentId?: unknown; id?: unknown }).investmentId ?? (data as { id?: unknown }).id)
          : undefined
      });
    } catch (e: unknown) {
      const str = isObject(e) && typeof (e as { message?: unknown }).message === 'string'
        ? String((e as { message: string }).message)
        : toDisplayString(e);
      if (str && (/401/.test(str) || /unauthor/i.test(str) || /auth/i.test(str))) {
        setInvestError('Authentication required');
      } else {
        setInvestError(str || 'Unable to create investment');
      }
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="dashboard-page container-custom">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold text-gradient mb-3">Investment Plans</h1>
        <p className="text-secondary fs-5">
          Choose your investment tier and start earning monthly returns
        </p>
      </div>

      {isLoading && (
        <div className="card border-gold card-hover mb-4">
          <div className="card-body text-center text-secondary">
            Loading plans...
          </div>
        </div>
      )}

      {!!errorMessage && (
        <div className="card border-gold card-hover mb-4">
          <div className="card-body text-center">
            <span className="text-danger">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-gold card-hover text-center">
            <div className="card-body">
              <TrendingUp size={32} className="text-success mb-2" />
              <h4 className="fw-bold text-gold mb-1">5-20%</h4>
              <p className="text-secondary mb-0">Monthly Returns</p>
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

      {/* Investment Form — moved to top (shows when a plan is selected) */}
      {selectedPlanData && (
        <div className="card border-gold card-hover mb-4">
          <div className="card-body">
            <h4 className="fw-bold text-white mb-4">
              Invest in {selectedPlanData.name}
            </h4>

            {investError && (
              <div className="alert alert-danger py-2" role="alert">
                {investError}
              </div>
            )}
            {investSuccess && (
              <div className="alert alert-success py-2" role="alert">
                Investment created successfully
                {investSuccess.reference ? ` — Ref: ${toDisplayString(investSuccess.reference)}` : ''}
              </div>
            )}

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

                  <Button variant="primary" className="w-100" disabled={!canInvest || isInvesting} onClick={onInvest}>
                    <DollarSign size={16} className="me-2" />
                    {isInvesting ? 'Processing...' : 'Invest Now'}
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
                    <span className="text-secondary">Monthly Return Rate:</span>
                    <span className="text-gold">{selectedPlanData.percentage}%</span>
                  </div>

                  <div className="calculation-item d-flex justify-content-between mb-2">
                    <span className="text-secondary">Monthly Earnings:</span>
                    <span className="text-success fw-bold">
                      ${(calculateReturns(investmentAmount, selectedPlanData.percentage)).toFixed(2)}
                    </span>
                  </div>

                  <hr className="border-light my-3" />

                  <div className="calculation-item d-flex justify-content-between">
                    <span className="text-white fw-bold">Total Return (30 days):</span>
                    <span className="text-gold fw-bold fs-5">
                      ${(investmentAmount + (calculateReturns(investmentAmount, selectedPlanData.percentage))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Plans */}
      <div className="row g-4 mb-5">
        {(plans ?? []).map((plan) => (
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
                  <p className="text-secondary mb-0">Monthly Returns</p>
                </div>

                <div className="investment-range mb-4">
                  <div className="range-container">
                    <div className="range-header d-flex justify-content-between align-items-center mb-3">
                      <span className="range-title text-white fw-medium">Investment Range</span>
                      <div className="range-percentage" style={{ color: plan.color }}>
                        {plan.percentage}% Monthly
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
        {!isLoading && !errorMessage && (plans ?? []).length === 0 && (
          <div className="col-12">
            <div className="card border-gold card-hover">
              <div className="card-body text-center text-secondary">
                No plans available.
              </div>
            </div>
          </div>
        )}
      </div>

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
                  <span className="text-secondary">Returns are calculated monthly</span>
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
