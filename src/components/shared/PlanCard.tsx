import { Plan } from '@/types/plans';
import styles from './PlanCard.module.scss';
import Button from '@/components/ui/Button';

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className={styles.planCard}>
      <div className={styles.planCard__header}>
        <h3 className={styles.planCard__title}>{plan.name}</h3>
        <p className={styles.planCard__description}>{plan.description}</p>
      </div>

      <div className={styles.planCard__body}>
        <div className={styles.planCard__roi}>
          <span className={styles.planCard__roiValue}>{plan.roi}%</span>
          <span className={styles.planCard__roiLabel}>ROI</span>
        </div>

        <div className={styles.planCard__details}>
          <div className={styles.planCard__detail}>
            <span className={styles.planCard__detailLabel}>Min Amount</span>
            <span className={styles.planCard__detailValue}>
              ${plan.minAmount.toLocaleString()}
            </span>
          </div>
          <div className={styles.planCard__detail}>
            <span className={styles.planCard__detailLabel}>Max Amount</span>
            <span className={styles.planCard__detailValue}>
              ${plan.maxAmount.toLocaleString()}
            </span>
          </div>
          <div className={styles.planCard__detail}>
            <span className={styles.planCard__detailLabel}>Duration</span>
            <span className={styles.planCard__detailValue}>{plan.duration} days</span>
          </div>
        </div>

        <div className={styles.planCard__features}>
          <h4 className={styles.planCard__featuresTitle}>Features</h4>
          <ul className={styles.planCard__featuresList}>
            {plan.features.map((feature, index) => (
              <li key={index} className={styles.planCard__feature}>
                <span className={styles.planCard__featureIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.planCard__footer}>
        <Button variant="primary" fullWidth>
          Invest Now
        </Button>
      </div>
    </div>
  );
}
