import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ISimulationSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionType: 'demo_basic' | 'demo_realistic' | 'market_replay' | 'stress_test';
  scenarioId?: string;
  startedAt: Date;
  endedAt?: Date;
  trades: mongoose.Types.ObjectId[];
  performance: {
    totalTrades: number;
    winRate: number;
    avgRR: number;
    maxDrawdown: number;
    behaviorScore: number;
  };
  stressConfig?: {
    forcedLosses: number;
    volatilityMultiplier: number;
    spreadMultiplier: number;
  };
  passed?: boolean;
  failureReasons: string[];
}

const simulationSessionSchema = new Schema<ISimulationSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionType: { type: String, enum: ['demo_basic', 'demo_realistic', 'market_replay', 'stress_test'], required: true },
    scenarioId: String,
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    trades: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
    performance: {
      totalTrades: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
      avgRR: { type: Number, default: 0 },
      maxDrawdown: { type: Number, default: 0 },
      behaviorScore: { type: Number, default: 100 },
    },
    stressConfig: {
      forcedLosses: Number,
      volatilityMultiplier: Number,
      spreadMultiplier: Number,
    },
    passed: Boolean,
    failureReasons: [String],
  },
  { timestamps: true }
);

simulationSessionSchema.index({ userId: 1, createdAt: -1 });

export const SimulationSession: Model<ISimulationSession> = mongoose.models.SimulationSession || mongoose.model<ISimulationSession>('SimulationSession', simulationSessionSchema);
