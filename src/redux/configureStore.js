import { createStore, combineReducers, applyMiddleware } from 'redux';
import { DefaultShip } from './defaultShip';
import { CurrentShip } from './currentShip';
import { Trends } from './trends';
import { Hover } from './hover';
import { Overview } from './overview';
import { FuelConsHover } from './fuelConsHover';
import { DailyData } from './dailyData';
import { DailyInput } from './dailyInput';
import { DailyCollapsible } from './dailyCollapsible';
import { Interactive } from './interactive';
import { Options } from './selectOptions';
import { LoginAuth } from './loginAuth';
import { Password } from './password';
import { DailyIssues } from './dailyIssues';
import { Ais } from './ais';
import { Create_IV } from './create_intervention';
import { Reports } from './reports';
import { Performance } from './performance';
import { PlotlyGraphUrls } from './plotly_graph_urls';
import {thunk} from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            defaultShip: DefaultShip,
            currentShip: CurrentShip,
            trends: Trends,
            hover: Hover,
            outlierhover: Hover,
            mlhover: Hover,
            fuelConsHover: FuelConsHover,
            dailyData: DailyData,
            dailyInput: DailyInput,
            dailyCollapsible: DailyCollapsible,
            interactive: Interactive,
            overview: Overview,
            options: Options,
            loginAuth: LoginAuth,
            password: Password,
            dailyIssues: DailyIssues,
            ais: Ais,
            create_iv: Create_IV,
            reports: Reports,
            performance: Performance,
            plotly_graph_urls: PlotlyGraphUrls
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
}