import React, { useEffect, useState } from "react";
import {
  Button,
  InlineStack,
  Thumbnail,
  Text,
  InlineError,
  BlockStack,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";

const ResoucePicker = ({ handleUploadImage }) => {
  const [formState, setFormState] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    handleUploadImage(formState.productImage);
  }, [formState]);

  async function selectProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // 'select' or 'add',
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];

      setFormState({
        productId: id,
        productVariantId: variants[0].id,
        productTitle: title,
        productHandle: handle,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
      });
    } else {
      setErrors({ productId: "No product selected. Please try again." });
    }
  }

  function resetProductSelection() {
    setFormState("");
  }
  //@ts-expect-error
  // console.log(window.ENV.IMAGE_URL)

  return (
    <div>
      {formState.productId ? (
        <BlockStack gap="200">
          <InlineStack blockAlign="center" gap="500">
            <Thumbnail
              source={formState.productImage || ImageIcon}
              alt={formState.productAlt}
            />
            <Text as="span" variant="headingMd" fontWeight="semibold">
              {formState.productTitle}
            </Text>
          </InlineStack>
          <Button onClick={selectProduct} id="change-product">
            Change Product
          </Button>
          {/* <Button onClick={resetProductSelection} id="reset-product" destructive>
            Reset Selection
          </Button> */}
        </BlockStack>
      ) : (
        <BlockStack gap="200">
          <Button onClick={selectProduct} id="select-product">
            Select Product
          </Button>
          {errors.productId && (
            <InlineError message={errors.productId} fieldID="product-error" />
          )}
        </BlockStack>
      )}
    </div>
  );
};

export default ResoucePicker;
