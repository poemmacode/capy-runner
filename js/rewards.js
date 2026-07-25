const Rewards = (() => {
  const RUBIES_FOR_MEDAL = 3;
  const MEDALS_FOR_CUP = 3;
  const POINTS_PER_RUBY = 150;

  let state = {
    score: 0,
    rubies: 0,
    medals: 0,
    cups: 0,
    nextRubyAt: POINTS_PER_RUBY,
    totalRubiesEver: 0,
  };

  function reset() {
    state = {
      score: 0,
      rubies: 0,
      medals: 0,
      cups: 0,
      nextRubyAt: POINTS_PER_RUBY,
      totalRubiesEver: 0,
    };
  }

  function addScore(points) {
    state.score += points;
    const events = [];
    while (state.score >= state.nextRubyAt) {
      state.rubies++;
      state.totalRubiesEver++;
      events.push('ruby');
      state.nextRubyAt += POINTS_PER_RUBY;

      if (state.rubies >= RUBIES_FOR_MEDAL) {
        state.rubies -= RUBIES_FOR_MEDAL;
        state.medals++;
        events.push('medal');

        if (state.medals >= MEDALS_FOR_CUP) {
          state.medals -= MEDALS_FOR_CUP;
          state.cups++;
          events.push('cup');
          events.push('victory');
        }
      }
    }
    return events;
  }

  function getState() {
    return { ...state };
  }

  function getDisplay() {
    return {
      score: state.score,
      rubies: state.rubies,
      medals: state.medals,
      cups: state.cups,
    };
  }

  return {
    reset,
    addScore,
    getState,
    getDisplay,
    POINTS_PER_RUBY,
    RUBIES_FOR_MEDAL,
    MEDALS_FOR_CUP,
  };
})();
