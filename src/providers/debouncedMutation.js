const debouncedMutation = ({ slide, timerRef, mutation, values, typename }) => {
  // eslint-disable-next-line no-underscore-dangle
  const __typename = typename || 'Slide';
  clearTimeout(timerRef.current);
  return setTimeout(
    () =>
      mutation({
        variables: {
          slide,
          ...values,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlide: {
            __typename,
            id: slide,
            ...values,
          },
        },
      }),
    500
  );
};

export default debouncedMutation;
