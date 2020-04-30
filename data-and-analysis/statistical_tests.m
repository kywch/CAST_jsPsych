%% Math Anxiety Leads to Math Avoidane in Effort-Based Decision-Making
% By Choe, Jenifer, Rozek, Berman, & Beilock
%
% All statistical tests performed in the order of appearance in the manuscript
% Tested with Matlab 2015b
%
% written by Kyoung Whan Choe 2019

clear;

% participant-level data
studyData{1} = csvread('Study1_data.csv', 1, 0);
studyData{2} = csvread('Study2_data.csv', 1, 0);
retestData = csvread('Study1R_data.csv', 1, 0);

% block-level data
load('Study1_block.mat');
blockData{1} = matBlock;
load('Study2_block.mat');
blockData{2} = matBlock;


%% Columns of the studyData
% col 1 (Age): continuous
% col 2 (Sex): (1) female, (2) male, (3) other/prefer not-to-answer (PNTA)
% col 3 (Edu_level): highest level of education completed -- (1) less than
%           high school, (2) high school diploma/GED, (3) some college
%           (4) Bachelor's degree, (5) Advanced degree, (6) PNTA
% col 4 (Highest_math): highest level of math course taken --
%           (1) pre-algebra, (2) algebra 1, (3) geometry, (4) algebra 2,
%           (5) trigonometry, (6) calculus, (7) higher than calculus
%           (8) PNTA
% col 5 (Curr_math): Currently taking any math? (1) yes, (2) no
% col 6 (Ethnicity): (1) Hispanic or Latino, (2) Not Hispanic of Latino,
%           (3) PNTA
% col 7 (Race): (1) American Indian or Alaska Native, (2) Asian
%           (3) Black or African American, (4) Native Hawaiian or other
%           Pacific Islander, (5) White, (6) Other, (7) PNTA
% col 8 (Income): Family's annual gross income -- (1) less than $15k,
%           (2) $15-35k, (3) $35-50k, (4) $50-75k, (5) $75-100k,
%           (6) $100k or more, (7) PNTA

% col 9 (MathAnx_score): short Math Anxiety Rating Scale (Alexander & Martray, 1989)
% col 10 (ReadAnx_score): a reading anxiety scale matched to sMARS
% col 11 (TraitAnx_score): trait anxiety items in the State-Trait Anxiety Inventory (Spielberger, 1983)
% col 12 (SocDsr_score): Marlowe-Crowne Socail Desirability Scale (Crowne & Marlowe, 1964)
% col 13 (TestAnx_score): the Test Anxiety Inventory (Spielberger, 1980)

% *** The below variables are from the task
% col 14 (points): Earned points from the task (1 point = 1 cent)
% col 15 (easy_math_cnt): number of solved easy math problems
% col 16 (easy_word_cnt): number of solved easy word problems
% col 17 (easy_acc_math): accuracy of easy math problems
% col 18 (easy_acc_word): accuracy of easy word problems
% col 19 (easy_RT_math): problem-solving duration of easy math problems
% col 20 (easy_RT_word): problem-solving duration of easy word problems
% col 21 (hard_math_cnt): number of solved hard math problems
% col 22 (hard_word_cnt): number of solved hard word problems
% col 23 (hard_level_math): avg difficulty level of hard math problems -- Used as a math competency measure
% col 24 (hard_level_word): avg difficulty level of hard word problems -- Used as a word competency measure
% col 25 (hard_acc_math): accuracy of hard math problems
% col 26 (hard_acc_word): accuracy of hard word problems
% col 27 (hard_RT_math): problem-solving duration of hard math problems
% col 28 (hard_RT_word): problem-solving duration of hard word problems
% col 29-33 (hcp_h2e2_math, hcp_h3e2_math, hcp_h4e2_math, hcp_h5e2_math,
%         hcp_h6e2_math): probability of choosing hard math options
%         in each reward condition (e.g., h2e2: Hard 2 vs. Easy 2)
% col 34 (hcp_h456e2_math): avg probability of choosing hard math options
%         when the hard options have higher expected rewards than easy ones
% col 35-39 (hcp_h2e2_word, hcp_h3e2_word, hcp_h4e2_word, hcp_h5e2_word,
%         hcp_h6e2_word: probability of choosing hard word options
%         in each reward condition (e.g., h2e2: Hard 2 vs. Easy 2)
% col 40 (hcp_h456e2_word): avg probability of choosing hard word options
%         when the hard options have higher expected rewards than easy ones

for iSt = 1:2
    studyTable{iSt} = array2table(studyData{iSt}, 'VariableNames', ...
        {'Age', 'Gen_tmp', 'Edu_level', 'Highest_math', 'Curr_math', 'Ethnicity', 'Race', 'Income', ... 1-8
        'sMARS', 'sRARS', 'STAI', 'SDS', 'TAI', 'points', ... 9-14
        'easy_math_cnt', 'easy_word_cnt', 'easy_acc_math', 'easy_acc_word', 'easy_RT_math', 'easy_RT_word', 'hard_math_cnt', 'hard_word_cnt', ... 15-22
        'hard_level_math', 'hard_level_word', 'hard_acc_math', 'hard_acc_word', 'hard_RT_math', 'hard_RT_word', ... 23-28
        'hcp_h2e2_math', 'hcp_h3e2_math', 'hcp_h4e2_math', 'hcp_h5e2_math', 'hcp_h6e2_math', 'hcp_h456e2_math', ... 29-34
        'hcp_h2e2_word', 'hcp_h3e2_word', 'hcp_h4e2_word', 'hcp_h5e2_word', 'hcp_h6e2_word', 'hcp_h456e2_word'} ); % 35-40
    
    % nominal variables
    studyTable{iSt}.Gender = nominal(studyTable{iSt}.Gen_tmp);
    studyTable{iSt}.Edu_level = nominal(studyTable{iSt}.Edu_level);
    studyTable{iSt}.Highest_math = nominal(studyTable{iSt}.Highest_math);
    studyTable{iSt}.Curr_math = nominal(studyTable{iSt}.Curr_math);
    studyTable{iSt}.Ethnicity = nominal(studyTable{iSt}.Ethnicity);
    studyTable{iSt}.Race = nominal(studyTable{iSt}.Race);
    studyTable{iSt}.Income = nominal(studyTable{iSt}.Income);
    
    % convert ms to seconds
    studyTable{iSt}.easy_RT_math = studyTable{iSt}.easy_RT_math / 1000;
    studyTable{iSt}.easy_RT_word = studyTable{iSt}.easy_RT_word / 1000;
    studyTable{iSt}.hard_RT_math = studyTable{iSt}.hard_RT_math / 1000;
    studyTable{iSt}.hard_RT_word = studyTable{iSt}.hard_RT_word / 1000;
    
    if iSt == 2
        studyTable{iSt}.hcp_h456e2_math = round(studyTable{iSt}.hcp_h456e2_math * 30) / 30;
    end
    
end

% the retest data has the same index as the studyData{1
% to ensure the rows are from the same Ps, compare the first three columns
retestTable = array2table(retestData, 'VariableNames', ...
    {'Prev_sMARS', 'Prev_hcp_h456e2_math', 'Prev_hcp_h456e2_word', 'points', ... 1-4
    'easy_math_cnt', 'easy_word_cnt', 'easy_acc_math', 'easy_acc_word', 'easy_RT_math', 'easy_RT_word', 'hard_math_cnt', 'hard_word_cnt', ... 4-11
    'hard_level_math', 'hard_level_word', 'hard_acc_math', 'hard_acc_word', 'hard_RT_math', 'hard_RT_word', ... 12-17
    'hcp_h2e2_math', 'hcp_h3e2_math', 'hcp_h4e2_math', 'hcp_h5e2_math', 'hcp_h6e2_math', 'hcp_h456e2_math', ... 18-23
    'hcp_h2e2_word', 'hcp_h3e2_word', 'hcp_h4e2_word', 'hcp_h5e2_word', 'hcp_h6e2_word', 'hcp_h456e2_word'} ); % 24-29



%% Correlation matrix of the self-report and behavioral measures (Tables S1-2)
fprintf(1, '\n\n');
disp('===================================================');
disp('Descriptive stats and correlations (Tables S1-2)');
disp('===================================================');

for iSt = 1:2    
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    tmpVct = [studyTable{iSt}.sMARS, studyTable{iSt}.sRARS, studyTable{iSt}.STAI, studyTable{iSt}.TAI, studyTable{iSt}.SDS, ...
        studyTable{iSt}.hcp_h456e2_math, studyTable{iSt}.hard_level_math, studyTable{iSt}.easy_acc_math, studyTable{iSt}.easy_RT_math, studyTable{iSt}.hard_acc_math, studyTable{iSt}.hard_RT_math, ...
        studyTable{iSt}.hcp_h456e2_word, studyTable{iSt}.hard_level_word, studyTable{iSt}.easy_acc_word, studyTable{iSt}.easy_RT_word, studyTable{iSt}.hard_acc_word, studyTable{iSt}.hard_RT_word];
    
    co = corrcoef(tmpVct(validSbj,:));
    
    if iSt == 1
        % this routine handles the participants who never chose hard options.
        nonnan = ~isnan(sum(tmpVct,2));
        %sum(validSbj & nonnan)
        co_nn = corrcoef(tmpVct(validSbj & nonnan,:));
        for ii = 1:length(co(:,1))
            for ij = 1:length(co(1,:))
                if isnan(co(ii,ij))
                    co(ii,ij) = co_nn(ii,ij);
                end
            end
        end
    end
    
    disp(['Study ', num2str(iSt), ' , mean, SD, correlations']);
    [nanmean(tmpVct(validSbj,:))', nanstd(tmpVct(validSbj,:))', co]
    
end



%% Hard Math & Word accuracy (Fig. 2B)
fprintf(1, '\n\n');
disp('===================================================');
disp('Hard math & word accuracy (Fig 2B)');
disp('===================================================');
for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    disp(['Study ', num2str(iSt), ' : hard math mean/SD, hard word mean/SD']);
    [nanmean(studyTable{iSt}.hard_acc_math(validSbj)) nanstd(studyTable{iSt}.hard_acc_math(validSbj)) nanmean(studyTable{iSt}.hard_acc_word(validSbj)) nanstd(studyTable{iSt}.hard_acc_word(validSbj))]
end


%% Easy Math & Word accuracy
fprintf(1, '\n\n');
disp('===================================================');
disp('Easy math & word accuracy');
disp('===================================================');
for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    disp(['Study ', num2str(iSt), ' : easy math mean/SD, easy word mean/SD']);
    [nanmean(studyTable{iSt}.easy_acc_math(validSbj)) nanstd(studyTable{iSt}.easy_acc_math(validSbj)) nanmean(studyTable{iSt}.easy_acc_word(validSbj)) nanstd(studyTable{iSt}.easy_acc_word(validSbj))]
end


%% The correlations between Hard choice probabilities with rewards > 3
% the correlations are over .9 for every pair
fprintf(1, '\n\n');
disp('===================================================');
disp('The correlations between HCPs with reward > 3');
disp('===================================================');
for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    tmpMap = [ studyTable{iSt}.hcp_h4e2_math, studyTable{iSt}.hcp_h5e2_math, studyTable{iSt}.hcp_h6e2_math, studyTable{iSt}.hcp_h4e2_word, studyTable{iSt}.hcp_h5e2_word, studyTable{iSt}.hcp_h6e2_word ];
    [co,pv] = corrcoef( [ tmpMap(validSbj,:) ] );
    disp(['Study ', num2str(iSt), ' : Math HCP 4-vs-5, 4-vs-6, 5-vs-6, Word HCP 4-vs-5, 4-vs-6, 5-vs-6']);
    [co(1,2), co(1,3), co(2,3), co(4,5), co(4,6), co(5,6)]
end


%% Math anxiety ~ math competence correlation (Fig. 2C)
fprintf(1, '\n\n');
disp('===================================================');
disp('Math anxiety ~ math ADL (preregistered hypothesis 3; Fig. 2C)');
disp('===================================================');
for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    % but also must filter out Ps who never solved hard problems
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7) & ~isnan(studyTable{iSt}.hard_level_math);
    [co,pv,lb,ub] = corrcoef( studyTable{iSt}.sMARS(validSbj), studyTable{iSt}.hard_level_math(validSbj) );
    disp(['Math anxiety-ADL: df = ', num2str(sum(validSbj)-2), ', r = ', num2str(co(1,2), 3), ', 95% CI [ ', num2str(lb(1,2), 3), ', ', num2str(ub(1,2), 3), ' ], p =', num2str(pv(1,2),3)]);
end


%% Block-by-block analysis to check the temporal stability (Fig. S1)
fprintf(1, '\n\n');
disp('===================================================');
disp('Block-by-block analysis to check the temporal stability (Fig. S1)');
disp('===================================================');
for iSt = 1:2
    % converting block data to table
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    tmpBlock = [];
    numBlock = length(blockData{iSt}(:,1,1));
    for iSbj = 1:length(validSbj)
        if validSbj(iSbj)
            % 'Subject', 'Block', 'math_HCP', 'math_comp', 'word_HCP', 'word_comp'
            for iB = 1:numBlock
                tmpBlock = vertcat(tmpBlock, ...
                    [iSbj, iB, blockData{iSt}(iB,[2 3 5 6],iSbj)]);
            end
        end
    end
    blockTable{iSt} = array2table(tmpBlock, 'VariableNames',{'Participant', 'Block', 'hcp_h456e2_math', 'hard_level_math', 'hcp_h456e2_word', 'hard_level_word'});
    blockTable{iSt}.Participant = nominal(blockTable{iSt}.Participant);
    
    % in the order of Fig. S2
    disp([' -- Study ', num2str(iSt), ': hard_level_math (ADL) ~ Block + (1 | Participant) >> lme{', num2str(iSt), ',1}' ]);
    lme{iSt,1} = fitlme( blockTable{iSt}, 'hard_level_math ~ Block + (1 | Participant)' );
    lme{iSt,1}.Coefficients
    disp([' -- Study ', num2str(iSt), ': hard_level_word (ADL)~ Block + (1 | Participant) >> lme{', num2str(iSt), ',2}' ]);
    lme{iSt,2} = fitlme( blockTable{iSt}, 'hard_level_word ~ Block + (1 | Participant)' );
    lme{iSt,2}.Coefficients
    disp([' -- Study ', num2str(iSt), ': hcp_h456e2_math (HCP) ~ Block + (1 | Participant) >> lme{', num2str(iSt), ',3}' ]);
    lme{iSt,3} = fitlme( blockTable{iSt}, 'hcp_h456e2_math ~ Block + (1 | Participant)' );
    lme{iSt,3}.Coefficients
    disp([' -- Study ', num2str(iSt), ': hcp_h456e2_word (HCP) ~ Block + (1 | Participant) >> lme{', num2str(iSt), ',4}' ]);
    lme{iSt,4} = fitlme( blockTable{iSt}, 'hcp_h456e2_word ~ Block + (1 | Participant)' );
    lme{iSt,4}.Coefficients
    
end



%% Test-retest reliability of math and word ADL (Fig. S2)
fprintf(1, '\n\n');
disp('===================================================');
disp('The test-retest reliability of math/word ADL (Fig. S2)');
disp('===================================================');
iSt = 1;
% the easy accuracy criteria: easy math and word, accuracy > .7
validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
rtstSbj = validSbj & ~isnan(studyTable{iSt}.hard_level_math) & ~isnan(studyTable{iSt}.hard_level_word) & ~isnan(retestTable.hard_level_math) & ~isnan(retestTable.hard_level_word);

% correlation -- hard_level_math, hard_level_word
[co,pv,lb,ub] = corrcoef( [ studyTable{iSt}.hard_level_math(rtstSbj), retestTable.hard_level_math(rtstSbj), studyTable{iSt}.hard_level_word(rtstSbj), retestTable.hard_level_word(rtstSbj) ] );
disp(['degrees of freedom: ', num2str(sum(rtstSbj)-2)]);
disp(['Math ADL test-retest: r = ', num2str(co(1,2), 3), ' [ ', num2str(lb(1,2), 3), ', ', num2str(ub(1,2), 3), ' ], p =', num2str(pv(1,2),3)]);
disp(['Word ADL test-retest: r = ', num2str(co(3,4), 3), ' [ ', num2str(lb(3,4), 3), ', ', num2str(ub(3,4), 3), ' ], p =', num2str(pv(3,4),3)]);


%% Test-retest reliability of math and word HCPs (Fig. S2)
fprintf(1, '\n\n');
disp('===================================================');
disp('The test-retest reliability of math/word HCP (Fig. S2)');
disp('===================================================');
iSt = 1;
% the easy accuracy criteria: easy math and word, accuracy > .7
validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
rtstSbj = validSbj & ~isnan(retestTable.easy_math_cnt);

% making sure the previous sMARS and HCPs are the same
assert(sum( studyTable{iSt}.sMARS(rtstSbj) ~= retestTable.Prev_sMARS(rtstSbj) ) == 0, 'Uh-oh');
assert(sum( studyTable{iSt}.hcp_h456e2_math(rtstSbj) ~= retestTable.Prev_hcp_h456e2_math(rtstSbj) ) == 0, 'Uh-oh');
assert(sum( studyTable{iSt}.hcp_h456e2_word(rtstSbj) ~= retestTable.Prev_hcp_h456e2_word(rtstSbj) ) == 0, 'Uh-oh');

% test-retest correlations
[co,pv,lb,ub] = corrcoef( [ retestTable.Prev_hcp_h456e2_math(rtstSbj), retestTable.hcp_h456e2_math(rtstSbj), retestTable.Prev_hcp_h456e2_word(rtstSbj), retestTable.hcp_h456e2_word(rtstSbj) ] );
disp([ 'degrees of freedom: ', num2str(sum(rtstSbj)-2)]);
disp(['Math HCP test-retest: r = ', num2str(co(1,2), 3), ' [ ', num2str(lb(1,2), 3), ', ', num2str(ub(1,2), 3), ' ], p =', num2str(pv(1,2),3)]);
disp(['Word HCP test-retest: r = ', num2str(co(3,4), 3), ' [ ', num2str(lb(3,4), 3), ', ', num2str(ub(3,4), 3), ' ], p =', num2str(pv(3,4),3)]);


%% Testing the math-specific effort avoidance hypothesis
% the main hypotheses (Fig. 3B)
fprintf(1, '\n\n');
disp('===================================================');
disp('Testing the math-specific effort avoidance hypothesis (Fig. 3B)');
disp('===================================================');
for iSt = 1:2
    
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    
    % correlations
    [co,pv,lb,ub] = corrcoef( [ studyTable{iSt}.sMARS(validSbj), studyTable{iSt}.hcp_h456e2_math(validSbj), studyTable{iSt}.hcp_h456e2_word(validSbj) ] );
    disp(['Study ', num2str(iSt), ', degrees of freedom: ', num2str(sum(validSbj)-2)]);
    disp(['Study ', num2str(iSt), ', Math HCP vs. Math Anxiety: r = ', num2str(co(1,2), 3), ' [ ', num2str(lb(1,2), 3), ', ', num2str(ub(1,2), 3), ' ], p =', num2str(pv(1,2),3)]);
    disp(['Study ', num2str(iSt), ', Word HCP vs. Math Anxiety: r = ', num2str(co(1,3), 3), ' [ ', num2str(lb(1,3), 3), ', ', num2str(ub(1,3), 3), ' ], p =', num2str(pv(1,3),3)]);
    %     sum(validSbj)
    %     [co,pv,lb,ub] = rankcorr( studyTable{iSt}.sMARS(validSbj), studyTable{iSt}.hcp_h456e2_math(validSbj) );
    %     disp(['Math HCP vs. Math Anxiety: rho = ', num2str(co, 3), ' [ ', num2str(lb, 3), ', ', num2str(ub, 3), ' ], p =', num2str(pv,3)]);
    %     [co,pv,lb,ub] = rankcorr( studyTable{iSt}.sMARS(validSbj), studyTable{iSt}.hcp_h456e2_word(validSbj) );
    %     disp(['Word HCP vs. Math Anxiety: rho = ', num2str(co, 3), ' [ ', num2str(lb, 3), ', ', num2str(ub, 3), ' ], p =', num2str(pv,3)]);
    %
    % interaction
    % The below linear mixed-effect model is to confirm that
    % the interaction effect of math vs. word is significant
    % -- Domain:sMARS, p < .001
    tmpData = [];
    for iSbj = 1:length(validSbj)
        if validSbj(iSbj)
            % add a row for math choice probability
            tmpData = vertcat(tmpData, ...
                [iSbj, 0, studyTable{iSt}.hcp_h456e2_math(iSbj), studyTable{iSt}.sMARS(iSbj), studyTable{iSt}.hard_level_math(iSbj), ...
                studyTable{iSt}.hard_acc_math(iSbj), studyTable{iSt}.hard_RT_math(iSbj), studyTable{iSt}.easy_acc_math(iSbj), studyTable{iSt}.easy_RT_math(iSbj)]);
            
            % add a row for word choice probability
            tmpData = vertcat(tmpData, ...
                [iSbj, 1, studyTable{iSt}.hcp_h456e2_word(iSbj), studyTable{iSt}.sMARS(iSbj), studyTable{iSt}.hard_level_word(iSbj), ...
                studyTable{iSt}.hard_acc_word(iSbj), studyTable{iSt}.hard_RT_word(iSbj), studyTable{iSt}.easy_acc_word(iSbj), studyTable{iSt}.easy_RT_word(iSbj)]);
        end
    end
    castInteract = array2table(tmpData, 'VariableNames', {'Participant', 'Domain', 'HCP', 'sMARS', 'ADL', 'Hard_acc', 'Hard_RT', 'Easy_acc', 'Easy_RT'});
    disp([' -- Study ', num2str(iSt), ' interaction: HCP ~ sMARS*Domain + ADL + Hard_acc + Hard_RT + Easy_acc + Easy_RT + (1 | Participant) >> lme{3,', num2str(iSt), '}' ]);
    lme{3, iSt} = fitlme( castInteract, 'HCP ~ sMARS*Domain + ADL + Hard_acc + Hard_RT + Easy_acc + Easy_RT + (1 | Participant)' );
    lme{3, iSt}.Rsquared
    lme{3, iSt}
    fprintf(1, '\n');
    
end



%% Examining potential problem-solving confounds on the math-specific effort avoidance
fprintf(1, '\n\n');
disp('===================================================');
disp('Checking the proportion of timeouts (Fig. S3C)');
disp('===================================================');

iSt = 2;
propMiss = numMiss(:,5) ./ numMiss(:,4);
nonnan = ~isnan(propMiss);

disp(['Study 2', num2str(iSt), ' proportion of timeouts: Mean, SD, Min, Max']);
[mean(propMiss(validSbj & nonnan)), std(propMiss(validSbj & nonnan)), min(propMiss(validSbj & nonnan)), max(propMiss(validSbj & nonnan))]

[co, pv, lb, ub] = corrcoef(studyTable{iSt}.sMARS(validSbj & nonnan), propMiss(validSbj & nonnan));
disp([ 'degrees of freedom: ', num2str(sum(validSbj & nonnan)-2)]);
disp(['Math anxiety ~ hard math timeouts: r = ', num2str(co(1,2), 3), ' [ ', num2str(lb(1,2), 3), ', ', num2str(ub(1,2), 3), ' ], p =', num2str(pv(1,2),3)]);




%% Linking math-specific component of math anxiety and math effort avoidance (Tables S5, 1)
% The comprehensive LMM analyses

fprintf(1, '\n\n');
disp('===================================================');
disp('Linking math-specific component of math anxiety and math effort avoidance (Tables S5 & 1)');
disp('The comprehensive linear mixed-effect models');
disp('===================================================');

for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);
    disp(['The LMM with random effects in Study ', num2str(iSt)]);
    lme{4, iSt} = fitlme( studyTable{iSt}(validSbj,:), ...
        ['hcp_h456e2_math ~ sMARS + sRARS + STAI + TAI + hard_level_math + hard_acc_math + hard_RT_math + easy_acc_math + easy_RT_math + hcp_h456e2_word ', ...
        '+ (1|Age) + (1|Gender) + (1|Edu_level) + (1|Highest_math) + (1|Curr_math) + (1|Ethnicity) + (1|Race) + (1|Income)']);
    lme{4, iSt}.Rsquared
    lme{4, iSt}
    fprintf(1, '\n');
end


fprintf(1, '\n\n');
disp('===================================================');
disp('Linking math-specific component of math anxiety and math effort avoidance (Tables S6-7)');
disp('The generalized binomial regression');
disp('===================================================');

for iSt = 1:2
    % the easy accuracy criteria: easy math and word, accuracy > .7
    validSbj = and(studyTable{iSt}.easy_acc_math > .7, studyTable{iSt}.easy_acc_word > .7);    
    disp(['The generalized binomial regression in Study ', num2str(iSt)]);
    lme{5, iSt} = fitglm( studyTable{iSt}(validSbj,:), ...
        ['hcp_h456e2_math ~ sMARS + sRARS + STAI + TAI + hard_level_math + hard_acc_math + hard_RT_math + easy_acc_math + easy_RT_math + hcp_h456e2_word '], ...
        'Distribution','binomial');
    lme{5, iSt}.Rsquared
    lme{5, iSt}
    fprintf(1, '\n');
end




